$(document).ready ->
  $('#order-option-definition-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false

    errorPlacement: (error, element) ->
      if element.attr('id') == 'order_option_name'
        error.addClass 'half-width'
      error.insertAfter(element)

    # This library handles focus oddly, this ensures that we scroll
    # to and focus on the first element with an error in the form
    onfocusout: false    
    invalidHandler: (form, validator) ->
      if validator.numberOfInvalids() > 0
        validator.errorList[0].element.focus()

    highlight: (element, errorClass) ->
      # Prevent highlighting the fields themselves
      return false

    rules:
      'order_option[name]':
        required: true
      'order_option[description]':
        required: true
      'order_option[scope]':
        required: true
      'order_option[form]':
        required: true

    messages:
      'order_option[name]':
        required: 'Order Option Name is required.'
      'order_option[description]':
        required: 'Description is required.'
      'order_option[scope]':
        required: 'Scope is required.'
      'order_option[form]':
        required: 'ECHO Form XML is required.'
