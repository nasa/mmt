# :nodoc:
class OrdersController < ManageCmrController
  add_breadcrumb 'Track Orders', :orders_path

  def index
  end

  def show
    @order = generate_order(params['id'])
  end

  def edit
  end

  def search
    @orders = []

    # Order Guid takes precedence over filters, if an order_guid is present
    # search for that rather than using the filters
    order_guids = if params['order_guid'].present?
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
                    order_search_result.parsed_body.fetch('Item', []).map { |guid| guid['OrderGuid'] }
                  end

    # Request the returned objects from ECHO
    order_objects = echo_client.get_orders(echo_provider_token, order_guids).parsed_body

    # Construct the full order hashes
    @orders = Array.wrap(order_objects.fetch('Item', [])).map do |order_obj|
      order = {
        'guid'           => order_obj['Guid'],
        'state'          => order_obj['State'],
        'creation_date'  => order_obj['CreationDate'],
        'submitted_date' => order_obj['SubmissionDate'],
        'updated_date'   => order_obj['LastUpdateDate']
      }

      contact_address = order_obj.fetch('ContactAddress', {})
      order['contact_name'] = "#{contact_address['FirstName']} #{contact_address['LastName']}".strip

      # Add user_id to order information
      user = echo_client.get_user_names(echo_provider_token, order_obj.fetch('OwnerGuid')).parsed_body

      order['user_id'] = user.fetch('Item', {}).fetch('Name', '')

      order
    end

    # if user_id param is supplied and we're not searching by guid, filter orders by given user_id
    unless params['order_guid'].present? || params['user_id'].empty?
      @orders.select! { |order| order['user_id'] == params['user_id'] }
    end

    @orders.sort_by! { |order| order['creation_date'] }
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
    contact_information['name'] = "#{contact_address.fetch('FirstName', '')} #{contact_address.fetch('LastName', '')}".strip
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
