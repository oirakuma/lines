require 'sinatra'
require 'json'

enable :sessions

get '/' do
  erb :index
end

get '/ranking' do
  @scores = File.readlines("scores.csv").map{|line|
    line.split(/\s+/)
  }.sort_by{|k,v|
    v.to_i
  }.reverse[0,10] rescue []
  @scores.to_json
end

post '/entry' do
  File.open("scores.csv","a"){|f|
    f.puts "#{params[:name]}\t#{params[:score]}"
  }
end
