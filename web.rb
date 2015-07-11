require 'sinatra'
require 'sinatra/reloader'
require 'json'
require 'yaml'
require 'twitter_oauth'

enable :sessions

get '/' do
  erb :index
end

get '/ranking' do
  h = Hash.new{|h,k|h[k] = []}
  File.readlines("scores.csv").map{|line|
    line.split(/\t/)
  }.map{|name, score, level|
    h[level.to_i] << [name, score.to_i]
  }
  h.each{|k,v|
    h[k] = v.sort_by{|name,score|score}.reverse[0,20]
  }
  h[1] ||= []
  h.to_json
end

post '/entry' do
  name = session[:screen_name] || params[:name]
  File.open("scores.csv","a"){|f|
    f.puts [name, params[:score], params[:level]].join("\t")
  }
end

before do
  h = YAML.load(File.read("setting.yml"))["twitter"]
  @twitter = TwitterOAuth::Client.new(
    :consumer_key => h["key"],
    :consumer_secret => h["secret"],
    :token => session[:access_token],
    :secret => session[:access_token_secret],
  )
end

get '/request_token' do
  callback_url = "#{base_url}/access_token"
  puts "----"
  p callback_url
  request_token = @twitter.request_token(:oauth_callback => callback_url)
  p request_token.authorize_url
  session[:request_token] = request_token.token
  session[:request_token_secret] = request_token.secret
  redirect request_token.authorize_url
end

get '/access_token' do
  begin
    @access_token = @twitter.authorize(
      session[:request_token],
      session[:request_token_secret],
      :oauth_verifier => params[:oauth_verifier]
    )
  rescue OAuth::Unauthorized => @exception
    session[:screen_name] = nil
    redirect '/'
  end

  session[:access_token] = @access_token.token
  session[:access_token_secret] = @access_token.secret
  session[:user_id] = @twitter.info['id']
  session[:screen_name] = @twitter.info['screen_name']
  session[:profile_image] = @twitter.info['profile_image_url_https']

  redirect '/'
end

def base_url
  default_port = (request.scheme == "http") ? 80 : 443
  port = (request.port == default_port) ? "" : ":#{request.port}"
  "#{request.scheme}://#{request.host}#{port}"
end
