$(document).ready ->
  $('#order-policies-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false

    errorPlacement: (error, element) ->
      if element.attr('type') == 'checkbox'
        element.closest('div').append(error)
      else
        error.insertAfter(element)
    onfocusout: (error) ->
      this.element(error)

    rules:
      retry_attempts:
        required: true
        number: true
      retry_wait_time:
        required: true
        number: true
      'supported_transactions[]':
        required: true
      max_items_per_order:
        range: [1, 5000]

    messages:
      retry_attempts:
        required: 'Retry Attempts is required.'
      retry_wait_time:
        required: 'Retry Wait Time is required.'
      'supported_transactions[]':
        required: 'Supported Transactions is required.'
      end_point:
        required: 'End Point is required.'