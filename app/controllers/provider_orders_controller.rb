# :nodoc:
class ProviderOrdersController < ManageCmrController
  add_breadcrumb 'Track Orders', :orders_path

  def show
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      @provider_order = generate_provider_order(params['id'])
    end
  end

  def edit
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      @provider_order = generate_provider_order(params['id'])
    end
  end

  def destroy
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      order_guid = params['order_guid']
      provider_tracking_id = params['provider_tracking_id']
      catalog_items = params['catalog_items']
      status_message = params['status_message']

      method = params['cancel'] == 'Yes' ? 'cancelled' : 'closed'

      result = if method == 'cancelled'
                 Rails.logger.info "Starting accept_provider_order_cancellation request sent at Time #{Time.now.to_i}"
                 echo_client.accept_provider_order_cancellation(echo_provider_token, order_guid, provider_tracking_id, catalog_items, status_message)
                 Rails.logger.info "Response from accept_provider_order_cancellation request received at Time #{Time.now.to_i}"
               else
                 Rails.logger.info "Starting close_provider_order request sent at Time #{Time.now.to_i}"
                 echo_client.close_provider_order(echo_provider_token, order_guid, provider_tracking_id, catalog_items, status_message)
                 Rails.logger.info "Response from close_provider_order request received at Time #{Time.now.to_i}"
               end

      if result.success?
        Rails.logger.info "#{method.capitalize} Provider Order(s) Success!"
        flash[:success] = "#{'Item'.pluralize(catalog_items.count)} successfully #{method}"
      else
        Rails.logger.error "#{method.capitalize} Provider Order Error: #{result.inspect}"
        flash[:error] = result.error_message
      end

      redirect_to provider_order_path(params['order_guid'])
    end
  end

  def resubmit
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      authorize :provider_order

      Rails.logger.info "Starting resubmit_order request sent at Time #{Time.now.to_i}"
      response = echo_client.resubmit_order(echo_provider_token, params[:id])
      Rails.logger.info "Response from resubmit_order request received at Time #{Time.now.to_i}"

      if response.error?
        Rails.logger.error "Resubmit Provider Order Error: #{response.inspect}"
        flash[:error] = response.error_message

        @provider_order = generate_provider_order(params['id'])

        render :show
      else
        Rails.logger.info 'Resumbit Provider Order Success!'
        flash[:success] = 'Order successfully resubmitted'

        redirect_to provider_order_path(params[:id])
      end
    end
  end

  private

  def generate_provider_order(guid)
    Rails.logger.info "Starting individual get_orders request in generate_provider_order sent at Time #{Time.now.to_i} with guid #{guid}"
    order_response = echo_client.get_orders(echo_provider_token, guid)
    Rails.logger.info "Response from individual get_orders request in generate_provider_order received at Time #{Time.now.to_i}"

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
      name_guids = echo_client.get_order_item_names_by_provider_order(echo_provider_token, provider_order_guid).parsed_body.fetch('Item', {})

      item_guids = Array.wrap(name_guids).map { |name_guid| name_guid.fetch('Guid', '') }

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
      Rails.logger.error("Generate Provider Order Error: #{order_response.inspect}")
      error_message = order_response.error_message || 'Could not load a provider order due to an unspecified error.'
      { 'error' => error_message }
    end
  end
end
