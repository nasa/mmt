class OrderOptionsController < ApplicationController

  def index
    @order_options = []

    order_option_response = echo_client.get_order_options(echo_provider_token)

    if order_option_response.success?
      # Retreive the order options and sort by name, ignoring case
      @order_options = order_option_response.parsed_body.fetch('Item', {}).sort_by { |option| option['Name'].downcase }
    end
  end

  def new
    @order_option = {}
    @scope_options = OrderOptionsHelper::ScopeOptions
  end

  def create
    @order_option = params[:order_option]
    @order_option.delete(:sort_key) if @order_option[:sort_key].blank?

    response = cmr_client.create_order_option(@order_option, echo_provider_token)

    if response.success?
      order_option_response = Hash.from_xml(response.body)
      order_option_id = order_option_response['option_definition']['id']
      flash[:success] = 'Order Option was successfully created.'
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
