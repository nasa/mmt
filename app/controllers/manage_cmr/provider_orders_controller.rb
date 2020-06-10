# :nodoc:
class ProviderOrdersController < ManageCmrController
  include LogTimeSpentHelper
  add_breadcrumb 'Track Orders', :orders_path

  def show
    init_time_tracking_variables
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      @provider_order = generate_provider_order(params['id'])
      render :show
    end
  rescue Faraday::TimeoutError
    flash[:alert] = "The order request #{request.uuid} timed out showing the order. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}."
    redirect_to orders_path
  end

  def edit
    init_time_tracking_variables
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      @provider_order = generate_provider_order(params['id'])

      render :edit
    end
  rescue Faraday::TimeoutError
    flash[:alert] = "The order request #{request.uuid} timed out editing the order. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}."
    redirect_to orders_path
  end

  def destroy
    init_time_tracking_variables
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      order_guid = params['order_guid']
      provider_tracking_id = params['provider_tracking_id']
      catalog_items = params['catalog_items']
      status_message = params['status_message']

      method = params['cancel'] == 'Yes' ? 'cancelled' : 'closed'

      result = log_time_spent "Provider Order request" do
        if method == 'cancelled'
          echo_client.accept_provider_order_cancellation(echo_provider_token, order_guid, provider_tracking_id, catalog_items, status_message)
        else
          echo_client.close_provider_order(echo_provider_token, order_guid, provider_tracking_id, catalog_items, status_message)
        end
      end

      if result.success?
        Rails.logger.info "#{method.capitalize} Provider Order(s) Success!"
        flash[:success] = "#{'Item'.pluralize(catalog_items.count)} successfully #{method}"
      else
        Rails.logger.error "#{method.capitalize} Provider Order Error: #{result.clean_inspect}"
        flash[:error] = result.error_message
      end

      redirect_to provider_order_path(params['order_guid'])
    end
  rescue Faraday::TimeoutError
    flash[:alert] = "The order request #{request.uuid} timed out deleting the order. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}."
    redirect_to orders_path
  end

  def resubmit
    init_time_tracking_variables
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      authorize :provider_order

      response = log_time_spent "resubmit_order request" do
        echo_client.timeout = @timeout_duration
        echo_client.resubmit_order(echo_provider_token, params[:id])
      end

      if response.error?
        Rails.logger.error "Resubmit Provider Order Error: #{response.clean_inspect}"
        flash[:error] = response.error_message

        @provider_order = generate_provider_order(params['id'])

        render :show
      else
        Rails.logger.info 'Resumbit Provider Order Success!'
        flash[:success] = 'Order successfully resubmitted'

        redirect_to provider_order_path(params[:id])
      end
    end
  rescue Faraday::TimeoutError
    flash[:alert] = "The order request #{request.uuid} timed out resubmitting order. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}."
    redirect_to orders_path
  end

  private

  def generate_provider_order(guid)
    order_response = log_time_spent "individual get_orders request in generate_provider_order with #{guid}" do
      echo_client.timeout = time_left
      echo_client.get_orders(echo_provider_token, guid)
    end

    if order_response.success?
      order_info = order_response.parsed_body.fetch('Item', {})
      provider_order = order_info.fetch('ProviderOrders', {}).fetch('Item', {})

      order = {}

      order['guid'] = order_info['Guid']

      provider_guid = provider_order.fetch('Guid', {}).fetch('ProviderGuid', nil)
      provider = get_provider_by_guid(provider_guid)
      order['provider_guid'] = provider['Guid']
      order['provider_id'] = provider['Name']

      order['tracking_id'] = provider_order['ProviderTrackingId']
      order['provider_order_state'] = provider_order['State']
      order['closed_date'] = provider_order['ClosedDate']

      provider_order_guid = provider_order['Guid']
      echo_client.timeout = time_left
      name_guids = echo_client.get_order_item_names_by_provider_order(echo_provider_token, provider_order_guid).parsed_body.fetch('Item', {})

      item_guids = Array.wrap(name_guids).map { |name_guid| name_guid.fetch('Guid', '') }

      echo_client.timeout = time_left
      items = echo_client.get_order_items(echo_provider_token, item_guids).parsed_body.fetch('Item', {})

      catalog_items = []
      Array.wrap(items).each do |order_item|
        order_item_detail = order_item.fetch('OrderItemDetail', {})

        catalog_item = {}
        catalog_item['item_guid'] = order_item.fetch('ItemGuid', '')
        catalog_item['status'] = order_item_detail.fetch('State', '')
        catalog_item['data_granule_id'] = order_item_detail.fetch('GranuleUR', '')
        catalog_item['local_granule_id'] = order_item_detail.fetch('ProducerGranuleId', '')
        option_selection = order_item.fetch('OptionSelection', {})
        catalog_item['option_selection'] = {}
        catalog_item['option_selection']['name'] = option_selection.fetch('Name', '')
        catalog_item['option_selection']['content'] = option_selection.fetch('Content', '')

        catalog_items << catalog_item
      end

      order['catalog_items'] = catalog_items.sort_by { |a| a['item_guid'] }
      order['status_messages'] = provider_order.fetch('StatusMessage', '').split("\n").map { |m| m.split(' : ') }

      Rails.logger.info "Generate Provider Order Success!"

      order
    else
      Rails.logger.error("Generate Provider Order Error: #{order_response.clean_inspect}")
      error_message = order_response.error_message || 'Could not load a provider order due to an unspecified error.'
      { 'error' => error_message }
    end
  end
end
