class OrderOptionsController < ApplicationController
  include OrderOptionsHelper

  def index
  end

  def new
    @order_option = {}
  end

  def create

    @order_option = params[:order_option]
    @order_option.delete(:sort_key) if @order_option[:sort_key].blank?

    response = temp_response = cmr_client.create_order_option(@order_option, echo_provider_token)

    if response.success?
      flash[:success] = 'Order Option was successfully created.'

      order_option_response = Hash.from_xml(response.body)
      order_option_id = order_option_response['option_definition']['id']

      redirect_to order_option_path(order_option_id)
    else
      Rails.logger.error("Create Order Option Error: #{response.inspect}")
      parsed_errors = Hash.from_xml(response.body)
      flash.now[:error] = parsed_errors['errors']['error'].inspect
      render :new
    end
  end

  def show
    order_option_id = params[:id]

    response = cmr_client.get_order_option(order_option_id, echo_provider_token)
    if response.success?
      @order_option = Hash.from_xml(response.body)['option_definition']
    else
      Rails.logger.error("Get Order Option Definition Error: #{response.inspect}")

      parsed_errors = Hash.from_xml(response.body)
      flash[:error] = parsed_errors['errors']['error'].inspect
      redirect_to order_options_path
    end
  end
end
