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
  # ユーザ登録されているか調べる。
  registerd = false
  File.open("users.csv").each_line{|line|
    k, v = line.split(/\s+/)
    if k == params[:username]
      if params[:password] == v
        session[:username] = params[:username]
      end
      registerd = true
    end
  }
  unless registerd
    File.open("users.csv","a"){|f|
      f.puts "#{params[:username]}\t#{params[:password]}"
    }
    session[:username] = params[:username]
  end
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
