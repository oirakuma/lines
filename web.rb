require 'sinatra'
require 'sinatra/reloader'
require 'json'

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
    h[k] = v.sort_by{|name,score|score}.reverse[0,10]
  }
  h[1] ||= []
  h[2] ||= []
  h.to_json
end

post '/entry' do
  File.open("scores.csv","a"){|f|
    f.puts [params[:name], params[:score], params[:level]].join("\t")
  }
end
