$(document).ready ->
  $('#order-option-definition-form').validate
    errorPlacement: (error, element) ->
      if element.attr('id') == 'order_option_name'
        error.addClass 'half-width'
      error.insertAfter(element)

    rules:
      'order_option[name]':
        required: true
      'order_option[description]':
        required: true
      'order_option[scope]':
        required: true
      'order_option[form]':
        required: true
      'order_option[Name]':
        required: true
      'order_option[Description]':
        required: true
      'order_option[Form]':
        required: true

    messages:
      'order_option[name]':
        required: 'Name is required.'
      'order_option[description]':
        required: 'Description is required.'
      'order_option[scope]':
        required: 'Scope is required.'
      'order_option[form]':
        required: 'Form XML is required.'
      'order_option[Name]':
        required: 'Name is required.'
      'order_option[Description]':
        required: 'Description is required.'
      'order_option[Form]':
        required: 'Form XML is required.'
