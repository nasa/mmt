$(document).ready ->
  # Index page -----------------------------------------------------------
  if $("#order-option-assignments-form").length > 0

    collectionsChooser = new Chooser({
      id: 'collectionsChooser',
      url: '/provider_collections',
      nextPageParm: 'page_num',
      filterParm: 'short_name',
      target: $('#chooser-widget'),
      fromLabel: 'Available collections',
      toLabel: 'Selected collections',
      uniqueMsg: 'Collection already added',
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
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false,
      rules:
        'collectionsChooser_toList[]':
          required: true
      messages:
        'collectionsChooser_toList[]':
          'Please select at least one collection'

    # select all of the items in the "to" list before submitting
    $('#submit-display-options').click ->
      $('#collectionsChooser_toList option').prop 'selected', true


  # Edit page -----------------------------------------------------------
  if $("#edit-order-option-assignments-page").length > 0

    # Form validation
    $('#edit-order-option-assignments-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false,
      rules:
        'order_option_assignment[]':
          required: true
      messages:
        'order_option_assignment[]':
          'Please select at least one collection'
      errorPlacement: (error, element) ->
        if element.attr('name') == 'order_option_assignment[]'
          error.addClass('full-width')
          $table = element.closest('table')
          error.insertAfter($table)

    #show/hide collections without options
    $("#show-no-assigned-options").on 'change', ->
      $("#no-assignments-msg").toggle()
      if $(this).prop('checked')
        $('tr.hidden-row').removeClass('hidden-row').addClass('shown-row')
      else
        $('tr.shown-row').removeClass('shown-row').addClass('hidden-row')

    # invoke the confirmation dialog before deleting
    $('#pre-delete-options-modal').click (e) ->
      e.preventDefault()
      if $('#edit-order-option-assignments-form').valid() == true
        $("#delete-options-modal-invoker").click()

  # New assignment page -----------------------------------------------------------
  if $("#new-order-option-assignment-form").length > 0

    collectionsChooser = new Chooser({
      id: 'collectionsChooser',
      url: '/provider_collections',
      nextPageParm: 'page_num',
      filterParm: 'short_name',
      target: $('#chooser-widget'),
      fromLabel: 'Available collections',
      toLabel: 'Selected collections',
      uniqueMsg: 'Collection already added',
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
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false,
      rules:
        'collectionsChooser_toList[]':
          required: true
      messages:
        'collectionsChooser_toList[]':
          'Please select at least one collection'

    # select all of the items in the "to" list before submitting
    $('#submit-new-options').click ->
      $('#collectionsChooser_toList option').prop 'selected', true