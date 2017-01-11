class OrderOptionsController < ManageCmrController
  include EchoSoap

  add_breadcrumb 'Order Options', :order_options_path

  RESULTS_PER_PAGE = 25

  def index
    # Default the page to 1
    page = params.fetch('page', 1)

    order_option_response = echo_client.get_order_options(echo_provider_token)

    order_option_list = if order_option_response.success?
                          # Retreive the order options and sort by name, ignoring case
                          order_option_response.parsed_body.fetch('Item', []).sort_by { |option| option['Name'].downcase }
                        else
                          []
                        end

    @order_options = Kaminari.paginate_array(order_option_list, total_count: order_option_response.parsed_body.fetch('Item', []).count).page(page).per(RESULTS_PER_PAGE)
  end

  def new
    @order_option = {}

    add_breadcrumb 'New', new_order_option_path
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

      add_breadcrumb @order_option.fetch('name', nil), order_option_path(order_option_id)
    else
      Rails.logger.error("Get Order Option Definition Error: #{response.inspect}")

      parsed_errors = Hash.from_xml(response.body)
      flash[:error] = parsed_errors['errors']['error'].inspect
      redirect_to order_options_path
    end
  end

  def edit
    @order_option_id = params[:id]

    response = cmr_client.get_order_option(@order_option_id, echo_provider_token)
    if response.success?
      @order_option = Hash.from_xml(response.body)['option_definition']

      add_breadcrumb @order_option.fetch('name', nil), order_option_path(@order_option_id)
      add_breadcrumb 'Edit', edit_order_option_path(@order_option_id)
    else
      Rails.logger.error("Get Order Option Definition Error: #{response.inspect}")

      parsed_errors = Hash.from_xml(response.body)
      flash[:error] = parsed_errors['errors']['error'].inspect
      redirect_to order_options_path
    end
  end

  def update
    @order_option = params[:order_option]
    @order_option.delete(:sort_key) if @order_option[:sort_key].blank?
    @order_option_id = params[:id]

    # Scope will always be PROVIDER
    @order_option['scope'] = 'PROVIDER'

    add_breadcrumb @order_option.fetch('name', nil), order_option_path(@order_option_id)
    add_breadcrumb 'Edit', edit_order_option_path(@order_option_id)

    soap_xml_response = echo_client.deprecate_order_options(echo_provider_token, Array.wrap(@order_option_id))

    # We have to deprecate the order before allowing to update. We will ignore the error it was already deprecated in case
    # the user tries to rename it something that already exists.
    unless soap_xml_response.success?
      if soap_xml_response.error_code != 'OptionDefAlreadyDeprecated'
        flash[:error] = soap_xml_response.error_message
        render :edit and return
      end
    end

    # "Updating" an order option is simply recreating it once it has been deprecated via ECHO SOAP API.
    response = cmr_client.create_order_option(@order_option, echo_provider_token)

    if response.success?
      order_option_response = Hash.from_xml(response.body)
      order_option_id = order_option_response['option_definition']['id']
      flash[:success] = 'Order Option was successfully updated.'
      redirect_to order_option_path(order_option_id)
    else
      Rails.logger.error("Update Order Option Error: #{response.inspect}")
      parsed_errors = Hash.from_xml(response.body)
      flash[:error] = parsed_errors['errors']['error'].inspect
      render :edit
    end
  end

  def destroy
    response = cmr_client.delete_order_option(params[:id], echo_provider_token)
    if response.success?
      order_option_response = Hash.from_xml(response.body)
      flash[:success] = 'Order Option was successfully deleted.'
      redirect_to order_options_path
    else
      Rails.logger.error("Delete Order Option Error: #{response.inspect}")
      parsed_errors = Hash.from_xml(response.body)
      flash[:error] = parsed_errors['errors']['error'].inspect
      redirect_to order_options_path
    end
  end

  def deprecate

    soap_xml_response = echo_client.deprecate_order_options(echo_provider_token, Array.wrap(params[:id]))

    if soap_xml_response.success?
      flash[:success] = 'Order Option was successfully deprecated.'
    else
      if soap_xml_response.error_code == 'OptionDefAlreadyDeprecated'
        flash[:error] = soap_xml_response.error_message
      else
        flash[:error] = 'An unknown error occurred. The Order Option could not be deprecated.'
      end
    end
    redirect_to order_options_path
  end

end
