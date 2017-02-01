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
      definition_guid:
        required: true
      'date_type':
        required: true
      'from_date':
        required: true
      'to_date':
        required: true

    messages:
      definition_guid:
        required: 'Data Quality Summary is required.'
      'date_type':
        required: 'Date type is required.'
      'from_date':
        required: 'From date is required.'
      'to_date':
        required: 'To date is required.'
