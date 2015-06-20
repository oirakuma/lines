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

post '/entry' do
  File.open("scores.csv","a"){|f|
    f.puts "#{params[:name]}\t#{params[:score]}"
  }
end
