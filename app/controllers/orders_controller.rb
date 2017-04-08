# :nodoc:
class OrdersController < ManageCmrController
  add_breadcrumb 'Track Orders', :orders_path

  def index; end

  def show
    @order = echo_client.get_orders(echo_provider_token, params['id']).parsed_body.fetch('Item', {})

    add_breadcrumb @order.fetch('Guid'), order_path(@order.fetch('Guid', nil))
  end

  def search
    @orders = []

    # Request the returned objects from ECHO
    order_response = echo_client.get_orders(echo_provider_token, determine_order_guids)

    if order_response.success?
      @orders = Array.wrap(order_response.parsed_body.fetch('Item', []))

      # if user_id param is supplied and we're not searching by guid, filter orders by given user_id
      if params['order_guid'].blank? && params['user_id'].present?
        @orders.each do |order|
          # Don't ask for owner information for guest orders
          next if order['OwnerGuid'].nil?

          order['OwnerName'] = echo_client.get_user_names(echo_provider_token, order['OwnerGuid']).parsed_body.fetch('Item', {}).fetch('Name', '')
        end

        @orders.select! { |order| order['OwnerName'] == params['user_id'] }
      end

      @orders.sort_by! { |order| order['CreationDate'] }
    else
      Rails.logger.error "Error searching for errors: #{order_response.error_message}"
    end
  end

  private

  def determine_order_guids
    # Order Guid takes precedence over filters, if an order_guid is present
    # search for that rather than using the filters
    if params['order_guid'].present?
      params['order_guid']
    else
      # Search for orders based on the provided filters
      payload = {
        'states'    => (params['states'] || OrdersHelper::ORDER_STATES),
        'date_type' => params['date_type'],
        'from_date' => params['from_date'],
        'to_date'   => params['to_date']
      }

      # Request orders from ECHO
      order_search_result = echo_client.get_provider_order_guids_by_state_date_and_provider(echo_provider_token, payload)

      # Pull out just the Guids for the returned orders
      Array.wrap(order_search_result.parsed_body.fetch('Item', [])).map { |guid| guid['OrderGuid'] }
    end
  end
end
