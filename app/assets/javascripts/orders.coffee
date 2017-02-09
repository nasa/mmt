$(document).ready ->
  $('#track-orders-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false

    errorPlacement: (error, element) ->
      error.insertAfter(element)

    onfocusout: (error) ->
      this.element(error)

    highlight: (element, errorClass) ->
      # Prevent highlighting the fields themselves
      return false

    rules:
      'date_type':
        required: true
      'from_date':
        required: true
      'to_date':
        required: true

    messages:
      'date_type':
        required: 'Date type is required.'
      'from_date':
        required: 'From date is required.'
      'to_date':
        required: 'To date is required.'

  $('a.show-option-selection').on 'click', ->
    $(this).siblings('.option-selection-content').toggle()
