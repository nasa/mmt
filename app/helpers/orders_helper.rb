# :nodoc:
module OrdersHelper
  LEGACY_ORDER_STATES = %w(
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

  ORDER_STATES = %w(
    VALIDATED
    PENDING_SUBMISSION
    SUBMITTING
    SUBMIT_FAILED
    SUBMIT_REJECTED
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

  def safe_date_output(date_text, default_message)
    if date_text.nil? or date_text.empty?
      default_message
    else
      DateTime.parse(date_text).to_s
    end
  end
end
