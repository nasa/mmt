$(document).ready ->
  $('#order-option-definition-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false

    errorPlacement: (error, element) ->
      error.insertAfter(element)
    onfocusout: (error) ->
      this.element(error)

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
