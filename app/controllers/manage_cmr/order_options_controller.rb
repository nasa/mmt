class OrderOptionsController < ManageCmrController
  add_breadcrumb 'Order Options', :order_options_path

  RESULTS_PER_PAGE = 25

  def index
    if use_legacy_order_service?
      legacy_set_order_options
    else
      set_order_options
    end
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

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    response = cmr_client.create_order_option(@order_option, echo_provider_token)

    if response.success?
      order_option_id = response.parsed_body['option_definition']['id']
      flash[:success] = 'Order Option was successfully created.'
      redirect_to order_option_path(order_option_id)
    else
      Rails.logger.error("Create Order Option Error: #{response.clean_inspect}")
      flash.now[:error] = response.parsed_body['errors']['error']
      render :new
    end
  end

  def show
    if use_legacy_order_service?
      legacy_show_order_option
    else
      show_order_option
    end
  end

  def edit
    if use_legacy_order_service?
      legacy_edit_order_option
    else
      edit_order_option
    end
  end

  def update
    if use_legacy_order_service?
      legacy_update_order_option
    else
      update_order_option
    end
  end

  def destroy
    if use_legacy_order_service?
      legacy_delete_order_option
    else
      delete_order_option
    end
  end

  def deprecate
    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    soap_xml_response = echo_client.deprecate_order_options(echo_provider_token, Array.wrap(params[:id]))
    if soap_xml_response.success?
      flash[:success] = 'Order Option was successfully deprecated.'
    else
      Rails.logger.error("Deprecate Order Option Error: #{soap_xml_response.error_message}")
      flash[:error] = soap_xml_response.error_message
    end
    redirect_to order_options_path
  end

  private

  def create_order_option

  end

  def legacy_create_order_option

  end

  def delete_order_option
    response = cmr_client.delete_order_option(native_id: params[:id], provider_id: current_user.provider_id, token: token)
    puts("########### delete response=#{response.inspect}")
    if response.success?
      flash[:success] = 'Order Option was successfully deleted.'
    else
      Rails.logger.error("#{request.uuid} - OrderOptionsController#delete_order_option - Delete Order Option Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
    end
    redirect_to order_options_path
  end

  def legacy_delete_order_option
    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    response = cmr_client.delete_order_option(params[:id], echo_provider_token)
    if response.success?
      flash[:success] = 'Order Option was successfully deleted.'
      redirect_to order_options_path
    else
      Rails.logger.error("Delete Order Option Error: #{response.clean_inspect}")
      flash[:error] = response.parsed_body['errors']['error']
      redirect_to order_options_path
    end
  end

  def edit_order_option
    @order_option_id = params[:id]
    response = cmr_client.get_order_options(id: @order_option_id, provider_id: current_user.provider_id, token: token)
    if response.success?
      @order_option = response.body.fetch('items', [])[0] unless response.body.fetch('items', []).empty?
      add_breadcrumb @order_option.fetch('umm', {}).fetch('Name', ''), order_option_path(@order_option_id)
      add_breadcrumb 'Edit', edit_order_option_path(@order_option_id)
    else
      Rails.logger.error("#{request.uuid} - OrderOptionsController#edit_order_option - Retrieving Order Option Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
      redirect_to order_options_path
    end
  end

  def legacy_edit_order_option
    @order_option_id = params[:id]

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    response = cmr_client.get_order_option(@order_option_id, echo_provider_token)
    if response.success?
      @order_option = response.parsed_body['option_definition']

      add_breadcrumb @order_option.fetch('name', nil), order_option_path(@order_option_id)
      add_breadcrumb 'Edit', edit_order_option_path(@order_option_id)
    else
      Rails.logger.error("Get Order Option Definition Error: #{response.clean_inspect}")
      flash[:error] = response.parsed_body['errors']['error']
      redirect_to order_options_path
    end
  end

  def update_order_option
    @order_option_id = params[:id]
    response = cmr_client.get_order_options(id: @order_option_id, provider_id: current_user.provider_id, token: token)
    if response.error?
      Rails.logger.error("#{request.uuid} - OrderOptionsController#update_order_option - Retrieving Order Option Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
      render :edit and return
    end
    @order_option = response.body.fetch('items', [])[0] unless response.body.fetch('items', []).empty?
    order_option = params[:order_option]
    if order_option.fetch(:SortKey, '').blank?
      @order_option['umm'].delete(:SortKey)
    else
      @order_option['umm']['SortKey'] = order_option.fetch(:SortKey, '')
    end
    @order_option['umm']['Name'] = order_option.fetch('Name', '')
    @order_option['umm']['Description'] = order_option.fetch('Description', '')
    @order_option['umm']['Form'] = order_option.fetch('Form', '')
    @order_option['umm']['Scope'] = 'PROVIDER'
    native_id = @order_option['meta']['native-id']

    update_response = cmr_client.create_update_order_option(order_option: @order_option, provider_id: current_user.provider_id, native_id: native_id, token: token)
    puts("$$$$$$$$$$ update response=#{update_response.inspect}")
    if update_response.success?
      flash[:success] = 'Order Option was successfully updated.'
      redirect_to order_option_path(@order_option_id)
    else
      Rails.logger.error("Update Order Option Error: #{update_response.clean_inspect}")
      flash[:error] = update_response.error_message
      render :edit
    end
  end

  def legacy_update_order_option
    @order_option = params[:order_option]
    @order_option.delete(:sort_key) if @order_option[:sort_key].blank?
    @order_option_id = params[:id]
    # Scope will always be PROVIDER
    @order_option['scope'] = 'PROVIDER'

    add_breadcrumb @order_option.fetch('name', nil), order_option_path(@order_option_id)
    add_breadcrumb 'Edit', edit_order_option_path(@order_option_id)

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    soap_xml_response = echo_client.deprecate_order_options(echo_provider_token, Array.wrap(@order_option_id))

    # We have to deprecate the order before allowing to update. We will ignore the error it was already deprecated in case
    # the user tries to rename it something that already exists.
    unless soap_xml_response.success?
      if soap_xml_response.error_code != 'OptionDefAlreadyDeprecated'
        Rails.logger.error("Deprecate Order Options to Update Error: #{soap_xml_response.clean_inspect}")
        flash[:error] = soap_xml_response.error_message
        render :edit and return
      end
    end

    # "Updating" an order option is simply recreating it once it has been deprecated via ECHO SOAP API.
    response = cmr_client.create_order_option(@order_option, echo_provider_token)

    if response.success?
      order_option_id = response.parsed_body['option_definition']['id']
      flash[:success] = 'Order Option was successfully updated.'
      redirect_to order_option_path(order_option_id)
    else
      Rails.logger.error("Update Order Option Error: #{response.clean_inspect}")
      flash[:error] = response.parsed_body['errors']['error']
      render :edit
    end
  end

  def show_order_option
    response = cmr_client.get_order_options(id: params[:id], provider_id: current_user.provider_id, token: token)
    if response.success?
      @order_option = response.body.fetch('items', [])[0] unless response.body.fetch('items', []).empty?
    else
      Rails.logger.error("#{request.uuid} - OrderOptionsController#show_order_option - Retrieving Order Option Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
      redirect_to order_options_path
    end
  end

  def legacy_show_order_option
    order_option_id = params[:id]

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    response = cmr_client.get_order_option(order_option_id, echo_provider_token)
    if response.success?
      @order_option = response.parsed_body['option_definition']

      @order_option['sort_key'] = 'n/a' if @order_option['sort_key'].blank?

      add_breadcrumb @order_option.fetch('name', nil), order_option_path(order_option_id)
    else
      Rails.logger.error("Get Order Option Definition Error: #{response.clean_inspect}")
      flash[:error] = response.parsed_body['errors']['error']
      redirect_to order_options_path
    end
  end

  def set_order_options
    permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.
    # Default the page to 1
    page = permitted.fetch('page', 1)
    order_options_response = cmr_client.get_order_options(provider_id: current_user.provider_id, token: token)
    if order_options_response.error?
      Rails.logger.error("#{request.uuid} - OrderOptionsController#set_order_options - Retrieving Order Options Error: #{order_options_response.clean_inspect}")
      flash[:error] = order_options_response.error_message
    end
    order_options = order_options_response.body.fetch('items', []) unless order_options_response.error?
    order_options = order_options.sort_by{ |option| option.fetch('umm', {}).fetch('Name', '').downcase }
    @order_options = Kaminari.paginate_array(order_options, total_count: order_options.count).page(page).per(RESULTS_PER_PAGE)
  end

  def legacy_set_order_options
    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.

    # Default the page to 1
    page = permitted.fetch('page', 1)

    order_option_response = get_order_option_list(echo_provider_token)

    order_option_list = Array.wrap(order_option_response.fetch('Result', [])).sort_by { |option| option.fetch('Name', '').downcase }
    @order_options = Kaminari.paginate_array(order_option_list, total_count: order_option_list.count).page(page).per(RESULTS_PER_PAGE)
  end
end
