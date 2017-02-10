class OrdersController < ManageCmrController
  add_breadcrumb 'Track Orders', :orders_path

  RESULTS_PER_PAGE = 25

  def index
  end

  def show
    @order = generate_order(params['id'])
  end

  def edit
  end

  def search
    @orders = []

    payload = {}
    payload['states'] = params.fetch('states', nil)
    payload['states'] = OrdersHelper::ORDER_STATES if payload['states'].nil?
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
      order['guid'] = guid['OrderGuid']
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
    unless params['user_id'].empty?
      @orders.select!{ |order| order['user_id'] == params['user_id'] }
    end
  end

  private

  def generate_order(guid)
    order_info = echo_client.get_orders(echo_provider_token, guid).parsed_body.fetch('Item', {})
    order = {}

    order['guid'] = guid
    order['state'] = order_info.fetch('State', '')
    order['order_price'] = order_info.fetch('OrderPrice', '')
    order['creation_date'] = order_info.fetch('CreationDate', '')
    order['submission_date'] = order_info.fetch('SubmissionDate', '')
    order['last_update_date'] = order_info.fetch('LastUpdateDate', '')
    user = echo_client.get_user_names(echo_provider_token, order_info.fetch('OwnerGuid', '')).parsed_body

    order['owner'] = user.fetch('Item', {}).fetch('Name', '')

    order['notify_level'] = order_info.fetch('NotifyLevel', '')
    order['user_domain'] = order_info.fetch('UserDomain', '')
    order['user_region'] = order_info.fetch('UserRegion', '')
    order['client_identity'] = order_info.fetch('ClientIdentity', '')

    order['contact_information'] = generate_contact_info(order_info.fetch('ContactAddress', {}))

    order['shipping_information'] = generate_contact_info(order_info.fetch('ShippingAddress', {}))

    order['billing_information'] = generate_contact_info(order_info.fetch('BillingAddress', {}))

    order
  end

  def generate_contact_info(contact_address)
    contact_information = {}

    contact_information['role'] = contact_address.fetch('Role', '')
    contact_information['name'] = "#{contact_address.fetch('FirstName', '')} #{contact_address.fetch('LastName', '')}"
    contact_information['organization'] = contact_address.fetch('Organization', '')

    address = contact_address.fetch('Address', {})
    contact_information['address'] = {}
    contact_information['address']['street1'] = address.fetch('Street1', '')
    contact_information['address']['street2'] = address.fetch('Street2', '')
    contact_information['address']['street3'] = address.fetch('Street3', '')
    contact_information['address']['city'] = address.fetch('City', '')
    contact_information['address']['state'] = address.fetch('State', '')
    contact_information['address']['zip'] = address.fetch('Zip', '')
    contact_information['address']['country'] = address.fetch('Country', '')
    contact_information['address']['special_instructions'] = address.fetch('SpecialInstructions', '')

    phones = contact_address.fetch('Phones', {}).fetch('Item', {})
    contact_information['phone'] = {}
    contact_information['phone']['number'] = phones.fetch('Number', '')
    contact_information['phone']['type'] = phones.fetch('PhoneNumberType', '')

    contact_information['email'] = contact_address.fetch('Email', '')

    contact_information
  end
end
