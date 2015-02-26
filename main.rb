require 'sinatra/base'
require 'active_record'
require 'yaml'
require "json"
require "json-fuzz-generator"
require 'logger'

# connecting databases
config = YAML.load_file('database.yml')
ActiveRecord::Base.establish_connection(config["prod"])

# log setting
logger = Logger.new(STDOUT)

#db override
class ReadEngTexts < ActiveRecord::Base
end
class Word < ActiveRecord::Base
end

class MainApp < Sinatra::Base
    # start setting for server run 
    set :environment, :production
    enable :method_override

    helpers do
        #自前で書かないとpartial出来んらしい
        def partial(template, options={})
            erb "_#{template}".to_sym, options.merge(:layout => false)
        end
    end

    get '/' do
        erb :index
    end

    #word codes
    post'/word.json' do
        content_type :json
        word         = Word.new
        word.word    = @params[:word]
        word.meaning = @params[:meaning]
        word.text_id = @params[:text_id]
        word.status  = @params[:status]
        word.save
        { :status => "sucsess" }.to_json
    end

    patch'/word.json' do
        content_type :json
        word = Word.find(@params[:id])
        word.status = @params[:status]
        word.save
        word.to_json
    end

    get'/word.json' do
        content_type :json
        Word.find(@params[:id]).to_json
    end

    delete '/word.json' do
        content_type :json
        Word.find(@params[:id]).delete
        { :status => "sucsess" }.to_json
    end

    get'/words.json' do
        content_type :json
        Word.where(["text_id = ?", @params[:id]]).to_json
    end

    # text codes
    post'/text_data.json' do
        content_type :json
        eng        = ReadEngTexts.new
        eng.title  = @params[:title]
        eng.text   = @params[:text]
        eng.status = @params[:status]
        eng.save
        { :id => eng.id }.to_json
    end

    patch'/text_data.json' do
        content_type :json
        eng = ReadEngTexts.find(@params[:id])
        eng.status = @params[:status]
        eng.save
        { :status => "sucsess" }.to_json
    end

    get '/text_data.json' do
        content_type :json
        ReadEngTexts.find(@params[:id]).to_json
    end

    delete '/text_data.json' do
        content_type :json
        ReadEngTexts.find(@params[:id]).delete
        { :status => "sucsess" }.to_json
    end

    get '/text_list.json' do
        content_type :json
        ReadEngTexts.all.to_json
    end

end
