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
end
