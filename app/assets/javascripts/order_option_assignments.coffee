$(document).ready ->

  # Index page -----------------------------------------------------------
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
    $('#chooser-loading-msg').hide()


  # Show page -----------------------------------------------------------
  if $("#show-order-option-assignments-form").length > 0

    $('.display-modal').leanModal
      top: 200
      overlay: 0.6
      closeButton: '.modal-close'

    # check/uncheck all
    $("#order-option-all-checkbox_").on 'change', ->

      top_checkbox = @

      $("#collections-table tbody tr").not(".hidden-row").each ->
        $(this).find("[name='order-option-checkbox[]']").prop 'checked', $(top_checkbox).prop 'checked'

    $("[name='order-option-checkbox[]']").on 'change', ->
      if ! $(this).prop 'checked'
        $("#order-option-all-checkbox_").prop 'checked', false


    # show collections without options
    $("#show-no-assigned-options").on 'change', ->
      if $(this).prop('checked')
        $('tr.hidden-row').removeClass('hidden-row').addClass('shown-row')
      else
        $('tr.shown-row').removeClass('shown-row').addClass('hidden-row')
        # uncheck the collection if it's hidden
        $("#collections-table tbody tr.hidden-row").find("[name='order-option-checkbox[]']").prop 'checked', false

    $("#show-order-option-assignments-form").submit ->
      if ! $("[name='order-option-checkbox[]']").prop 'checked'
        # "click" the dummy link to invoke the modal (there's no other way to do this)
        $('#dummy-modal-link').click()
        return false



  # New assignment page -----------------------------------------------------------
  if $("#new-order-option-assignment-form").length > 0
    $("#order-option-all-checkbox_").on 'change', ->
      $("[name='collection-checkbox[]']").prop 'checked', $(this).prop 'checked'

    $("#new-order-option-assignment-form").submit ->
      if ! $("[name='collection-checkbox[]']").prop 'checked'
        # "click" the dummy link to invoke the modal (there's no other way to do this)
        $('#dummy-modal-link').click()
        return false





