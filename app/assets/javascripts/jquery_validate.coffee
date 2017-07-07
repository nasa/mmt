$.validator.setDefaults
  errorClass: 'eui-banner--danger validation-error'
  errorElement: 'div'
  onkeyup: false

  errorPlacement: (error, element) ->
    message = '<i class="fa fa-exclamation-triangle"></i> '
    message += $(error).text()
    error.html(message)
    error.insertAfter(element)

  onfocusout: (error) ->
    this.element(error)

  highlight: (element, errorClass) ->
    # Prevent highlighting the fields themselves
    return false
