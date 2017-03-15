# :nodoc:
class ProviderOrdersController < ManageCmrController
  add_breadcrumb 'Track Orders', :orders_path

  def show
    @provider_order = generate_provider_order(params['id'])
  end

  def edit
    @provider_order = generate_provider_order(params['id'])
  end

  def destroy
    order_guid = params['order_guid']
    provider_tracking_id = params['provider_tracking_id']
    catalog_items = params['catalog_items']
    status_message = params['status_message']

    method = params['commit'] == 'Cancel Items' ? 'cancelled' : 'closed'

    result = if method == 'cancelled'
               echo_client.accept_provider_order_cancellation(echo_provider_token, order_guid, provider_tracking_id, catalog_items, status_message)
             else
               echo_client.close_provider_order(echo_provider_token, order_guid, provider_tracking_id, catalog_items, status_message)
             end

    if result.success?
      flash[:success] = "#{'Item'.pluralize(catalog_items.count)} successfully #{method}"
    else
      flash[:error] = result.error_message
    end

    redirect_to provider_order_path(params['order_guid'])
  end

  def resubmit
    authorize :provider_order

    response = echo_client.resubmit_order(echo_provider_token, params[:id])

    if response.error?
      flash[:error] = response.error_message

      @provider_order = generate_provider_order(params['id'])

      render :show
    else
      flash[:success] = 'Order successfully resubmitted'

      redirect_to provider_order_path(params[:id])
    end
  end

  private

  def generate_provider_order(guid)
    order_info = echo_client.get_orders(echo_provider_token, guid).parsed_body.fetch('Item', {})
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

    order['catalog_items'] = catalog_items.sort { |a, b| a['item_guid'] <=> b['item_guid'] }
    order['status_messages'] = provider_order.fetch('StatusMessage', '').split("\n").map { |m| m.split(' : ') }

    order
  end
end
