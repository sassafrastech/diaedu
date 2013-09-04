require_dependency "diaedu/application_controller"

module Diaedu
  class TriggersController < ::ApplicationController
    PER_PAGE = 10

    before_filter(:parse_filter_params, :only => :index)

    def index
      page = params[:page].to_i || 1

      # sleep for a second in dev mode to test loading indicators
      sleep(0.25) if Rails.env == 'development'
      
      render(:json => {
        :objs => Diaedu::Trigger.includes(:tags).offset((page - 1) * PER_PAGE).limit(PER_PAGE).all.as_json(:include => :tags),
        :per_page => PER_PAGE,
        :total_count => Diaedu::Trigger.count
      })
    end

    private
      def parse_filter_params
        @filter = Diaedu::Filter.new(params[:filter_params])
      end
  end
end
