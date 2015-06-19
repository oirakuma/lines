require 'sinatra'

enable :sessions

get '/' do
  @scores = File.readlines("scores.csv").map{|line|
    line.split(/\s+/)
  }.sort_by{|k,v|
    v.to_i
  }.reverse[0,10] rescue []
  erb :index
end

post '/login' do
  session[:username] = params[:username]
  redirect '/'
end

get '/logout' do
  session[:username] = nil
  redirect '/'
end

post '/entry' do
  if session[:username]
    File.open("scores.csv","a"){|f|
      f.puts "#{session[:username]}\t#{params[:score]}"
    }
  end
end
