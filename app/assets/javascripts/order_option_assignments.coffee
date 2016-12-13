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

    $('.order-option-assignments-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false,
      rules:
        'collectionsChooser_toList[]':
          required: true
      messages:
        'collectionsChooser_toList[]':
          'Please select at least one collection'


    $('#submit-display-options').click ->
      $('#collectionsChooser_toList option').prop 'selected', true


  # Edit page -----------------------------------------------------------
  if $("#edit-order-option-assignments-form").length > 0

    $('.display-modal').leanModal
      top: 200
      overlay: 0.6
      closeButton: '.modal-close'

    # check/uncheck all
    $("#order-option-all-checkbox").on 'change', ->
      top_checkbox = @
      $("#collections-table tbody tr").not(".hidden-row").each ->
        $(this).find("[name='order-option-checkbox[]']").prop 'checked', $(top_checkbox).prop 'checked'

    # Uncheck the "check all" if not all checkboxes are  checked
    $("[name='order-option-checkbox[]']").on 'change', ->
      if ! $(this).prop 'checked'
        $("#order-option-all-checkbox").prop 'checked', false


    # show collections without options
    $("#show-no-assigned-options").on 'change', ->
      if $(this).prop('checked')
        $('tr.hidden-row').removeClass('hidden-row').addClass('shown-row')
      else
        $('tr.shown-row').removeClass('shown-row').addClass('hidden-row')
        # uncheck the collection if it's hidden
        $("#collections-table tbody tr.hidden-row").find("[name='order-option-checkbox[]']").prop 'checked', false


    $('#edit-order-option-assignments-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false,
      rules:
        'order-option-checkbox[]':
          required: (element) ->
            $('input[name="order-option-checkbox[]"]:checked').length < 1
      errorPlacement: (error, element) ->
        if element.attr('name') == 'order-option-checkbox[]'
          error.addClass('full-width')
          $table = element.closest('table')
          error.insertAfter($table)
        else
          error.insertAfter(element)
      messages:
        'order-option-checkbox[]':
          'Please select at least one collection'



  # New assignment page -----------------------------------------------------------
  if $("#new-order-option-assignment-form").length > 0
    $("#order-option-all-checkbox").on 'change', ->
      $("[name='collection-checkbox[]']").prop 'checked', $(this).prop 'checked'

    $('#new-order-option-assignment-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false,
      rules:
        'collection-checkbox[]':
          required: (element) ->
            $('input[name="collection-checkbox[]"]:checked').length < 1
      errorPlacement: (error, element) ->
        if element.attr('name') == 'collection-checkbox[]'
          error.addClass('full-width')
          $table = element.closest('table')
          error.insertAfter($table)
        else
          error.insertAfter(element)
      messages:
        'collection-checkbox[]':
          'Please select at least one collection'






