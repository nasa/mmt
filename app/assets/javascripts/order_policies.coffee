$(document).ready ->
  # widget for choosing collections
  collectionsChooser = null

  if collectionsChooser == null
    collectionsChooser = new Chooser({
      id: 'collections_supporting_duplicate_order_items',
      url: '/provider_collections',
      filterParm: 'keyword',
      uniqueIdentifierParam: 'concept_id',
      filterChars: '1',
      endlessScroll: false,
      target: $('#order-policies-chooser-widget'),
      fromLabel: 'Available Collections',
      toLabel: 'Selected Collections',
      showNumChosen: true,
      forceUnique: true,
      uniqueMsg: 'Collection is already selected.',
      attachTo: $('#order-policies-collection-selections'),
      filterText: "Filter Collections...",
      removeAdded: false,
      addButton: {
        cssClass: 'eui-btn nowrap',
        arrowCssClass: 'fa fa-arrow-right',
        text: ''
      },
      delButton: {
        cssClass: 'eui-btn nowrap',
        arrowCssClass: 'fa fa-arrow-left',
        text: ''
      },
      delAllButton: {
        cssClass: 'eui-btn nowrap',
        arrowCssClass: 'fa fa-backward',
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
  $.ajax '/provider_collections?' + $.param('concept_id': selectedValues),
    success: (data) ->
      # Sets the selected values of the chooser
      collectionsChooser.val(data)
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
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false

    errorPlacement: (error, element) ->
      if element.attr('type') == 'checkbox'
        element.closest('div').append(error)
      else
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
      'supported_transactions[]':
        required: 'Supported Transactions is required.'
      end_point:
        required: 'End Point is required.'
