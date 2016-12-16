$(document).ready ->
  if $(".permission-form").length > 0

    $('.display-modal').leanModal
      top: 200
      overlay: 0.6
      closeButton: '.modal-close'

    # widget for choosing collections
    collectionsChooser = null

    start_widget = ->
      if collectionsChooser == null
        collectionsChooser = new Chooser({
          id: 'collectionsChooser',
          url: '/permission/all_collections',
          nextPageParm: 'page_num',
          filterParm: 'short_name',
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

        $('#collectionsChooser_toList').rules 'add',
            required:
              depends: ->
                if $('#collection_options').val() == 'selected-ids-collections'
                  return true
                return false
            messages:
             required: 'Please specify collections.'


    # show the Chooser widget if a refresh of the page has "selected collections" as the dropdown value
    setTimeout ( ->
      if $('#collection_options').val() == 'selected-ids-collections'
        $('#chooser-widget').show()
        start_widget()

        if $('#collection_selections').val()? && $('#collection_selections').val().length > 0
          opts = []
          entry_titles = $('#collection_selections').val().split("%%__%%")
          $.each entry_titles, (index, value)->
            opt_val = value.split('|')[1].trim()
            opts.push( [opt_val, value] )
          collectionsChooser.setToVal(opts);
    ), 500

    # Show respective field based on selection
    $('#collection_options').on 'change', ->
      if $(this).val() == 'selected-ids-collections'
        $('#chooser-widget').show()
        start_widget()
      else
        $('#chooser-widget').hide()

    $('#granule_options').on 'change', ->
      if $(this).val() == 'access-constraint-granule'
        $('#granules-constraint-values').removeClass 'is-hidden'
      else
        $('#granules-constraint-values').addClass 'is-hidden'



    # Validate new permissions form with jquery validation plugin
    $('.permission-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false,

      errorPlacement: (error, element) ->
        if element.attr('id') == 'search_groups_' || element.attr('id') == 'search_and_order_groups_'
          # error placement is trickier with the groups because of select2 and the table
          # placing it after the table
          error.addClass('full-width')
          $table = element.closest('table')
          error.insertAfter($table)
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
        permission_name:
          required: true
        collection_options:
          required: true
          valueNotEquals: 'select'
        granule_options:
          required: true
          valueNotEquals: 'select'
        # could not make require_from_group work, so adding our own dependency
        'search_groups[]':
          required: (element) ->
            # field is required if the other field has no value/selection
            $('#search_and_order_groups_').val() == null
        'search_and_order_groups[]':
          required: (element) ->
            # field is required if the other field has no value/selection
            $('#search_groups_').val() == null

      messages:
        permission_name:
          required: 'Permission Name is required.'
        collection_options:
          # we are using the valueNotEquals method, so need to use that message
          valueNotEquals: 'Collections must be specified.'
        granule_options:
          # we are using the valueNotEquals method, so need to use that message
          valueNotEquals: 'Granules must be specified.'
        'search_groups[]':
          required: 'Please specify at least one Search group or one Search & Order group.'
        'search_and_order_groups[]':
          required: 'Please specify at least one Search group or one Search & Order group.'

      groups:
        # this should make it so only one message is shown for both elements
        permission_group: 'search_groups[] search_and_order_groups[]'


    # adding a method so the collections and granules default values ('select') are not valid
    $.validator.addMethod 'valueNotEquals', (value, elem, arg) ->
      arg != value
    , 'Selection is required.' # this is the default message used if not specified in the messages options object

    visitedPermissionGroupSelect = []

    $('#search_groups_').select2()
    .on 'select2:open', (e) ->
      # add the id to visited array on open
      id = $(this).attr('id')
      visitedPermissionGroupSelect.push id unless visitedPermissionGroupSelect.indexOf(id) != -1
    .on 'select2:close', (e) ->
      # check if the visited array has both select2 fields, and if so validate on close
      if visitedPermissionGroupSelect.indexOf('#search_groups_') != -1 && visitedPermissionGroupSelect.indexOf('#search_and_order_groups_') != -1
        $(this).valid()

    $('#search_and_order_groups_').select2()
    .on 'select2:open', (e) ->
      id = $(this).attr('id')
      visitedPermissionGroupSelect.push id unless visitedPermissionGroupSelect.indexOf(id) != -1
    .on 'select2:close', (e) ->
      # check if the visited array has both select2 fields, and if so validate on close
      if visitedPermissionGroupSelect.indexOf('search_groups_') != -1 && visitedPermissionGroupSelect.indexOf('search_and_order_groups_') != -1
        $(this).valid()

    $('#permissions-save-button').click( ->
      $('#collectionsChooser_toList').find('option:first').prop('selected', true)
      $('#collectionsChooser_toList').find('option:first').click()
    )
