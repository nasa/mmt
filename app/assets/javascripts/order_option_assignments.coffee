$(document).ready ->
  if $(".order-option-assignments-form").length > 0

    collectionsChooser = new Chooser({
      id: 'collectionsChooser',
      url: '/permission/all_collections',
      nextPageParm: 'page_num',
      filterParm: 'entry_id',
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
        arrowCssClass: 'eui-circle-right',
        text: 'Add collection(s)'
      },
      delButton: {
        cssClass: 'eui-btn nowrap',
        arrowCssClass: 'eui-circle-left',
        text: 'Remove collection(s)'
      },
      allowRemoveAll: false,
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





