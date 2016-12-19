$(document).ready ->

  # Index page -----------------------------------------------------------
  if $("#order-option-assignments-form").length > 0

    collectionsChooser = new Chooser({
      id: 'collectionsChooser',
      url: '/provider_collections',
      nextPageParm: 'page_num',
      filterParm: 'keyword',
      filterChars: '1',
      endlessScroll: false,
      target: $('#chooser-widget'),
      fromLabel: 'Available collections',
      toLabel: 'Selected collections',
      showNumChosen: true,
      forceUnique: true,
      uniqueMsg: 'Collection already added',
      filterText: "Filter collections",
      removeAdded: false,
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

    #show collections without options
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
      filterParm: 'keyword',
      filterChars: '1',
      endlessScroll: false,
      target: $('#chooser-widget'),
      fromLabel: 'Available collections',
      toLabel: 'Selected collections',
      showNumChosen: true,
      forceUnique: true,
      uniqueMsg: 'Collection already added',
      filterText: "Filter collections",
      removeAdded: false,
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





