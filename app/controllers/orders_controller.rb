class OrdersController < ManageCmrController
  add_breadcrumb 'Track Orders', :orders_path

  RESULTS_PER_PAGE = 25

  def index
  end

  def edit
  end

  def update
    @orders = []

    payload = {}
    payload['states'] = params.fetch('states', nil)
    payload['states'] = ['VALIDATED', 'NOT_VALIDATED', 'QUOTING', 'QUOTE_REJECTED', 'QUOTE_FAILED', 'QUOTED', 'SUBMITTING', 'SUBMIT_REJECTED', 'SUBMIT_FAILED', 'PROCESSING', 'CANCELLING', 'CANCELLED', 'CLOSED'] if payload['states'].nil?
    payload['date_type'] = params.fetch('date_type', nil)
    payload['from_date'] = params.fetch('from_date', nil)
    payload['to_date'] = params.fetch('to_date', nil)

    # Get order guids
    order_guids = echo_client.get_provider_order_guids_by_state_date_and_provider(echo_provider_token, payload).parsed_body

    # For each order guid, get order information
    @orders = []
    Array.wrap(order_guids.fetch('Item', [])).each do |guid|
      order = {}

      order_info = echo_client.get_orders(echo_provider_token, guid['OrderGuid']).parsed_body

      item = order_info.fetch('Item', {})
      order['state'] = item.fetch('State', '')
      order['creation_date'] = item.fetch('CreationDate', '')
      order['submitted_date'] = item.fetch('SubmissionDate', '')
      order['updated_date'] = item.fetch('LastUpdateDate', '')
      contact_address = item.fetch('ContactAddress', {})
      first_name = contact_address.fetch('FirstName', '')
      last_name = contact_address.fetch('LastName', '')
      order['contact_name'] = "#{first_name} #{last_name}"

      # Add user_id to order information
      user = echo_client.get_user_names(echo_provider_token, item.fetch('OwnerGuid')).parsed_body

      order['user_id'] = user.fetch('Item', {}).fetch('Name', '')

      @orders << order
    end

    # if user_id param is supplied, filter orders by given user_id
    if params.fetch('user_id') != ''
      @orders.select!{ |order| order['user_id'] == params.fetch('user_id') }
    end

    render action: :edit
  end
end
