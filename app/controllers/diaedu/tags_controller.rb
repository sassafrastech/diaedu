module Diaedu
  class TagsController < ::ApplicationController

    # returns json-formatted list of tags matching params[:q]
    def suggest
      render(:json => Diaedu::Tag.suggestions(params[:q]).as_json(:id_name_only => true), :root => false)
    end
  end
end