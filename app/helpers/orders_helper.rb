# :nodoc:
module OrdersHelper
  ORDER_STATES = %w(
    VALIDATED
    NOT_VALIDATED
    QUOTING
    QUOTE_REJECTED
    QUOTE_FAILED
    QUOTED
    SUBMITTING
    SUBMIT_REJECTED
    SUBMIT_FAILED
    PROCESSING
    CANCELLING
    CANCELLED
    CLOSED
  ).freeze

  TERMINAL_ORDER_STATES = %w(
    CANCELLED
    CLOSED
    SUBMIT_FAILED
    SUBMIT_REJECTED
  ).freeze

  def state_is_terminal(order_state)
    OrdersHelper::TERMINAL_ORDER_STATES.include?(order_state)
  end

  def order_owner(owner_guid)
    if owner_guid.blank?
      '(guest)'
    else
      user = echo_client.get_user_names(echo_provider_token, owner_guid).parsed_body

      user.fetch('Item', {}).fetch('Name', '')
    end
  end

  def contact_info(contact_address)
    contact_address['Name'] = contact_name(contact_address)
    contact_address['Phone'] = contact_address.fetch('Phones', {}).fetch('Item', {})

    contact_address
  end

  def contact_name(contact)
    [contact['FirstName'], contact['LastName']].reject(&:empty?).join(' ')
  end
end
