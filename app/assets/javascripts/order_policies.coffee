$(document).ready ->
  $('#duplicate-order-items').tablesorter
    # Prevent sorting on the checkboxes
    headers:
      0: 
        sorter: false

  $('#order-policies-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false

    errorPlacement: (error, element) ->
      if element.attr('type') == 'checkbox'
        element.closest('div').append(error)
      else
        error.insertAfter(element)
        
    # This library handles focus oddly, this ensures that we scroll
    # to and focus on the first element with an error in the form
    onfocusout: false    
    invalidHandler: (form, validator) ->
      if validator.numberOfInvalids() > 0
        validator.errorList[0].element.focus();

    highlight: (element, errorClass) ->
      # Prevent highlighting the fields themselves
      return false

    rules:
      retry_attempts:
        required: true
        number: true
      retry_wait_time:
        required: true
        number: true
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