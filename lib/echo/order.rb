module Echo
  class Order
    def initialize(client: nil, echo_provider_token: nil, guid: nil, response: nil)
      @client = client
      @token = echo_provider_token

      if response.nil?
        order_response = @client.get_orders(@token, guid)
        if order_response.success?
          @order = order_response.parsed_body.fetch('Item', {})
        else
          @order = {}
          Rails.logger.error "Error retrieving order: #{order_response.error_message}"
        end
      else
        @order = response
      end
    end

    def guid
      @order['Guid']
    end

    def state
      @order['State']
    end

    def price
      @order['OrderPrice']
    end

    def created_date
      format_date(@order['CreationDate'], default: '')
    end

    def submitted_date
      format_date(@order['SubmissionDate'], default: '')
    end

    def updated_date
      format_date(@order['LastUpdateDate'], default: 'Never Updated')
    end

    def owner_guid
      @order['OwnerGuid']
    end

    def owner
      if owner_guid.blank?
        '(guest)'
      else
        # refactor to a new class in the future if/when it is needed
        user = cached_owner

        user.fetch('Item', {}).fetch('Name', '')
      end
    end

    def notify_level
      @order['NotifyLevel']
    end

    def user_domain
      @order['UserDomain']
    end

    def user_region
      @order['UserRegion']
    end

    def client_identity
      @order['ClientIdentity']
    end

    def contact_address
      ContactInformation.new(@order.fetch('ContactAddress', {}))
    end

    def shipping_address
      ContactInformation.new(@order.fetch('ShippingAddress', {}))
    end

    def billing_address
      ContactInformation.new(@order.fetch('BillingAddress', {}))
    end

    private

    def cached_owner
      Rails.cache.fetch("owners.#{owner_guid}", expires_in: 15.minutes) do
        @client.get_user_names(@token, owner_guid).parsed_body
      end
    end

    def format_date(date, default: nil)
      DateTime.parse(date).to_s(:echo_format)
    rescue
      default || date.to_s
    end
  end

  class ContactInformation
    def initialize(contact_info)
      @contact_info = contact_info
    end

    def role
      @contact_info['Role']
    end

    def name
      [@contact_info.fetch('FirstName', ''), @contact_info.fetch('LastName', '')].reject(&:empty?).join(' ')
    end

    def organization
      @contact_info['Organization']
    end

    def street_1
      @contact_info.fetch('Address', {})['Street1']
    end

    def street_2
      @contact_info.fetch('Address', {})['Street2']
    end

    def street_3
      @contact_info.fetch('Address', {})['Street3']
    end

    def city
      @contact_info.fetch('Address', {})['City']
    end

    def state
      @contact_info.fetch('Address', {})['State']
    end

    def zip
      @contact_info.fetch('Address', {})['Zip']
    end

    def country
      @contact_info.fetch('Address', {})['Country']
    end

    def phone_number
      phones.first['Number']
    end

    def phone_number_type
      phones.first['PhoneNumberType']
    end

    def phone_and_type
      value = phone_number
      value += " (#{phone_number_type})" unless phone_number_type.nil?

      value
    end

    def email
      @contact_info['Email']
    end

    private

    def phones
      Array.wrap(@contact_info.fetch('Phones', {}).fetch('Item', {}))
    end
  end
end
