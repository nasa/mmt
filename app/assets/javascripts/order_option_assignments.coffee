$(document).ready ->
  if $(".order-option-assignments-form").length > 0

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
      attachTo: $('#collection_selections'),
      delimiter: "%%__%%",
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

  if $("#create-order-option-assignment-form").length > 0



    $("#order-option-all-checkbox_").on 'change', ->
        $("[name='order-option-checkbox[]']").prop 'checked', $(this).prop 'checked'

    $("[name='order-option-checkbox[]']").on 'change', ->
      if ! $(this).prop 'checked'
        $("#order-option-all-checkbox_").prop 'checked', false





