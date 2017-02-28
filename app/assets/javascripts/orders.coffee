$(document).ready ->
  $('#order-by-guid-form').validate
    rules:
      'order_guid':
        required: true

    messages:
      'order_guid':
        required: 'Order GUID is required.'

  $('#track-orders-form').validate
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

  $('#cancel-provider-order-form').validate
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
