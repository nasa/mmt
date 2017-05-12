$(document).ready ->

  if $('.order-policy').length > 0

    $('#test-endpoint-modal').leanModal
      top: 200
      overlay: 0.6
      closeButton: '.modal-close'

    $('#test-endpoint-connection').click ->
      $('#test-endpoint-dialog-button').text 'Cancel'
      $('#modal-message').text 'Please wait...'
      $.ajax(
        type: 'post'
        data:
          url: $('#order-policy-endpoint').text()
        url: '/order_policies/test_endpoint_connection'
        success: (response) ->
          $('#modal-message').text response.message
          $('#test-endpoint-dialog-button').text 'Ok'
        error: (req, status, error) ->
          $('#modal-message').text 'Test endpoint connection failed. Please try again.'
          $('#test-endpoint-dialog-button').text 'Ok'
          console.error(status, error)
      )

  if $("#order-policies-form").length > 0
    # widget for choosing collections
    collectionsChooser = null

    if collectionsChooser == null
      collectionsChooser = new Chooser({
        id: 'collections_supporting_duplicate_order_items',
        url: '/provider_collections',
        nextPageParm: 'page_num',
        filterParm: 'short_name',
        uniqueIdentifierParam: 'concept_id',
        target: $('#order-policies-chooser-widget'),
        fromLabel: 'Available Collections',
        toLabel: 'Selected Collections',
        uniqueMsg: 'Collection is already selected.',
        attachTo: $('#order-policies-collection-selections'),
        addButton: {
          cssClass: 'eui-btn nowrap',
          arrowCssClass: 'fa fa-plus',
          text: ''
        },
        delButton: {
          cssClass: 'eui-btn nowrap',
          arrowCssClass: 'fa fa-minus',
          text: ''
        },
        delAllButton: {
          cssClass: 'eui-btn nowrap',
          arrowCssClass: 'fa fa-trash',
          text: ''
        },
        allowRemoveAll: true,
        errorCallback: ->
          $('<div class="eui-banner--danger">' +
            'A server error occurred. Unable to get collections.' +
            '</div>').prependTo '#main-content'
      })

      collectionsChooser.init()

    # Form an array of the values that were previously selected
    selectedValues = ($(element).val() for element in $('#order-policies-form .selected-collection'))

    # Ping the same endpoint we use for populating the Chooser widget
    # to retrieve data specific to the selected values
    if selectedValues.length > 0
      # Not providing any concept ids will result in all items coming back, avoid that
      $.ajax '/provider_collections',
        method: 'POST'
        data: 
          concept_id: selectedValues
          page_size: selectedValues.length
        success: (data) ->
          # Sets the selected values of the chooser
          collectionsChooser.setToVal(data.items)
        fail: (data) ->
          console.log data

    # On form submit, select all of the options in the 'Selected Collections' multiselect
    # so that it can be properly interpreted by the controller
    $('#order-policies-form').on 'submit', ->
      $('#collections_supporting_duplicate_order_items_toList option').prop('selected', true)

    $('#duplicate-order-items').tablesorter
      # Prevent sorting on the checkboxes
      headers:
        0: 
          sorter: false
        3:
          sorter: 'text'

    $('#order-policies-form').validate
      errorPlacement: (error, element) ->
        if element.attr('type') == 'checkbox'
          element.closest('div').append(error)
        else
          error.insertAfter(element)
          
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
        end_point:
          required: 'End Point is required.'
