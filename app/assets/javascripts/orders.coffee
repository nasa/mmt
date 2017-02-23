$(document).ready ->
  searchFiltersRequired = ->
    $('#order_guid').val() == ''

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
        required: 
          depends: searchFiltersRequired
      'from_date':
        required: 
          depends: searchFiltersRequired
      'to_date':
        required: 
          depends: searchFiltersRequired

    messages:
      'date_type':
        required: 'Date type is required.'
      'from_date':
        required: 'From date is required.'
      'to_date':
        required: 'To date is required.'

  $('a.show-option-selection').on 'click', ->
    $(this).siblings('.option-selection-content').toggle()

  $('#cancel-provider-order-form').validate
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
      'catalog_items[]':
        required: true
      'status_message':
        required: true

    messages:
      'catalog_items[]':
        required: 'You must select at least 1 catalog item.'
      'status_message':
        required: 'Status message is required.'
