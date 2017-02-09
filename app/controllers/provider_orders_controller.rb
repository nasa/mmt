class ProviderOrdersController < ManageCmrController
  add_breadcrumb 'Track Orders', :orders_path

  def show
    @provider_order = generate_provider_order(params['id'])
  end

  private

  def generate_provider_order(guid)
    order_info = echo_client.get_orders(echo_provider_token, guid).parsed_body.fetch('Item', {})
    provider_order = order_info.fetch('ProviderOrders', {}).fetch('Item', {})

    order = {}

    order['guid'] = order_info['Guid']
    order['provider_id'] = echo_client.get_provider_names(echo_provider_token, provider_order.fetch('Guid', {}).fetch('ProviderGuid', '')).parsed_body.fetch('Item', {}).fetch('Name', '')

    order['tracking_id'] = provider_order['ProviderTrackingId']
    order['provider_order_state'] = provider_order['State']
    order['closed_date'] = provider_order['ClosedDate']

    provider_order_guid = provider_order['Guid']
    name_guids = echo_client.get_order_item_names_by_provider_order(echo_provider_token, provider_order_guid).parsed_body.fetch('Item', {})

    item_guids = Array.wrap(name_guids).map { |name_guid| name_guid.fetch('Guid', '') }

    items = echo_client.get_order_items(echo_provider_token, item_guids).parsed_body

    catalog_items = []
    Array.wrap(items).each do |item|
      order_item = item.fetch('Item', {})
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

    order['catalog_items'] = catalog_items
    order['status_messages'] = provider_order.fetch('StatusMessage', '').split("\n")

    receipt = {}
    order_receipt = provider_order.fetch('OrderReceipt', {})
    receipt['acceptance_date'] = order_receipt.fetch('AcceptanceDate', '')
    receipt['estimated_ship_date'] = order_receipt.fetch('EstimatedShipDate', '')
    receipt['latest_cancel_date'] = order_receipt.fetch('LatestCancelDate', '')

    order['receipt'] = receipt

    order
  end
end
