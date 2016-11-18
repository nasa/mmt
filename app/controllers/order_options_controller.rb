class OrderOptionsController < ApplicationController

  RESULTS_PER_PAGE = 25

  def index
    # Initialize an empty order options list
    @order_options = []

    # Default the page to 1
    page = params.fetch('page', 1)

    order_option_response = echo_client.get_order_options(echo_provider_token)

    if order_option_response.success?
      # Retreive the order options and sort by name, ignoring case
      order_option_list = order_option_response.parsed_body.fetch('Item', {}).sort_by { |option| option['Name'].downcase }

      @order_options = Kaminari.paginate_array(order_option_list, total_count: order_option_list.count).page(page).per(RESULTS_PER_PAGE)
    end
  end

  def new
    @order_option = {}
  end

  def create
    @order_option = params[:order_option]
    @order_option.delete(:sort_key) if @order_option[:sort_key].blank?

    # Scope will always be PROVIDER
    @order_option['scope'] = 'PROVIDER'

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

      if @order_option['sort_key'].blank?
        @order_option['sort_key'] = 'n/a'
      end

    else
      Rails.logger.error("Get Order Option Definition Error: #{response.inspect}")

      parsed_errors = Hash.from_xml(response.body)
      flash[:error] = parsed_errors['errors']['error'].inspect
      redirect_to order_options_path
    end
  end

  def edit
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

  def update
    fail
  end

end
