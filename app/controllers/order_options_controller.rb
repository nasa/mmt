class OrderOptionsController < ApplicationController

  def index
  end

  def new
    @order_option = {}
  end

  def create
    @order_option = params[:order_option]
    @order_option.delete(:sort_key) if @order_option[:sort_key].blank?

    response = cmr_client.create_order_option(@order_option, token)
    if response.success?

      # fail
    else
      Rails.logger.error("Create Order Option Error: #{response.inspect}")
      flash[:error] = response.body
      render :new
    end
  end

  def show
  end
end
