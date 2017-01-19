$(document).ready ->
  if $("#service-option-form").length > 0
    $('#service-option-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
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
        'service_option[name]':
          required: true
        'service_option[description]':
          required: true
        'service_option[form]':
          required: true

      messages:
        'service_option[name]':
          required: 'Name is required.'
        'service_option[description]':
          required: 'Description is required.'
        'service_option[form]':
          required: 'Form XML is required.'