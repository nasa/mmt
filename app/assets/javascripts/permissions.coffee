$(document).ready ->
  if $(".permissions-form").length > 0

    # widget for choosing collections
    collectionsChooser = null

    start_widget = ->
      if collectionsChooser == null
        collectionsChooser = new Chooser({
          id: 'collectionsChooser',
          url: '/permission/all_collections',
          nextPageParm: 'page_num',
          filterParm: 'entry_id',
          filterChars: '1',
          resetSize: 20,
          target: $('#chooser-widget'),
          fromLabel: 'Available collections',
          toLabel: 'Chosen collections',
          showNumChosen: true,
          forceUnique: true,
          attachTo: $('#collection_selections'),
          errorCallback: ->
            $('<div class="eui-banner--danger">' +
                'A server error occurred. Unable to get collections.' +
                '</div>').prependTo '#main-content'
        })
        collectionsChooser.init()


    $('#chooser-widget').show()
    start_widget()

    $('#search_groups_').select2()
    $('#search_and_order_groups_').select2()

    # Hide field by default
    $('#collection_ids_chosen').addClass 'is-hidden'


    $('#chooser-widget').hide()

    # Show respective field based on selection
    $('#collections').on 'change', ->
      if $(this).val() == 'selected-ids-collections'
        $('#chooser-widget').show()
        start_widget()
      else
        $('#chooser-widget').hide()


    $('#granules').on 'change', ->
      if $(this).val() == 'access-constraint-granule'
        $('#granules-constraint-values').removeClass 'is-hidden'
      else
        $('#granules-constraint-values').addClass 'is-hidden'

    # Toggle group input field
    $('#groups-table button').on 'click', (e) ->
      e.preventDefault()
      $(this).addClass 'is-hidden'
      $(this).siblings('#search_order_groups_chosen').removeClass 'is-hidden'
      $(this).siblings('#search_groups_chosen').removeClass 'is-hidden'



    if $("#search_groups_prev_val").val()?
      tmp_val = $("#search_groups_prev_val").val().split(",")
      $("#search_groups_").val(tmp_val)
      $("#search_groups_").select2()

    if $("#search_and_order_groups_prev_val").val()?
      tmp_val = $("#search_and_order_groups_prev_val").val().split(",")
      $("#search_and_order_groups_").val(tmp_val)
      $("#search_and_order_groups_").select2()



    # Validate new permissions form with jquery validation plugin
    $('.permissions-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
        if element.attr('id') == 'search_groups_' || element.attr('id') == 'search_and_order_groups_'
          # error placement is trickier with the groups because of select2 and the table
          # placing it after the table
          error.addClass('full-width')
          $table = element.closest('table')
          error.insertAfter($table)
        else
          error.insertAfter(element)

      onfocusout: (error) ->
        this.element(error)

      highlight: (element, errorClass) ->
        # Prevent highlighting the fields themselves
        return false

      rules:
        permission_name:
          required: true
        collections:
          required: true
          valueNotEquals: 'select'
        granules:
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
        collections:
          # we are using the valueNotEquals method, so need to use that message
          valueNotEquals: 'Collections must be specified.'
        granules:
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





