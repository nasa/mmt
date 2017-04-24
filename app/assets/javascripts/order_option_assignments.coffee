$(document).ready ->
  # Index page -----------------------------------------------------------
  if $("#order-option-assignments-form").length > 0

    collectionsChooser = new Chooser({
      id: 'collectionsChooser',
      url: '/provider_collections',
      nextPageParm: 'page_num',
      filterParm: 'short_name',
      target: $('#chooser-widget'),
      fromLabel: 'Available Collections',
      toLabel: 'Selected Collections',
      uniqueMsg: 'Collection is already selected',
      toMax: 100,
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

    $('#order-option-assignments-form').validate
      rules:
        'collectionsChooser_toList[]':
          required: true
      messages:
        'collectionsChooser_toList[]':
          'You must select at least 1 collection.'

    # select all of the items in the "to" list before submitting
    $('#order-option-assignments-form').submit ->
      $('#collectionsChooser_toList option').prop('selected', true)


  # Edit page -----------------------------------------------------------
  if $("#edit-order-option-assignments-page").length > 0

    $('.tablesorter').tablesorter
      # Prevent sorting on the checkboxes
      headers:
        0:
          sorter: false
        3:
          sorter: 'text'

    # Form validation
    $('#edit-order-option-assignments-form').validate
      errorPlacement: (error, element) ->
        if element.attr('name') == 'order_option_assignment[]'
          error.addClass('full-width')
          $table = element.closest('table')
          error.insertAfter($table)

      rules:
        'order_option_assignment[]':
          required: true
      messages:
        'order_option_assignment[]':
          'You must select at least 1 assignment.'

    #show/hide collections without options
    $("#show-no-assigned-options").on 'change', ->
      $("#no-assignments-msg").toggle()
      if $(this).prop('checked')
        $('tr.hidden-row').removeClass('hidden-row').addClass('shown-row')
      else
        $('tr.shown-row').removeClass('shown-row').addClass('hidden-row')

  # New assignment page -----------------------------------------------------------
  if $("#new-order-option-assignment-form").length > 0

    collectionsChooser = new Chooser({
      id: 'collectionsChooser',
      url: '/provider_collections',
      nextPageParm: 'page_num',
      filterParm: 'short_name',
      target: $('#chooser-widget'),
      fromLabel: 'Available Collections',
      toLabel: 'Selected Collections',
      uniqueMsg: 'Collection is already selected',
      toMax: 100,
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

    chosen_collections = JSON.parse($("#chosen-collections").val())

    if chosen_collections && chosen_collections.length > 0
      collectionsChooser.setToVal(chosen_collections)

    $('#new-order-option-assignment-form').validate
      errorPlacement: (error, element) ->
        if element.attr('name') == 'collectionsChooser_toList[]'
          element.closest('fieldset').append(error)
        else
          error.insertAfter(element)

      rules:
        'order-options':
          required: true
        'collectionsChooser_toList[]':
          required: true

      messages:
        'order-options':
          required: 'Order Option is required.'
        'collectionsChooser_toList[]':
          required: 'You must select at least 1 collection.'

    # select all of the items in the "to" list before submitting
    $('#new-order-option-assignment-form').submit ->
      $('#collectionsChooser_toList option').prop('selected', true)