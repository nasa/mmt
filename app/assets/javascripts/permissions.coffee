$(document).ready ->

  # Hide field by default
  $('#collection_ids_chosen').addClass 'is-hidden'

  #$('#search_order_groups_chosen').addClass 'is-hidden'
  #$('#search_groups_chosen').addClass 'is-hidden'

  # Show respective field based on selection
  $('#collections').on 'change', ->
    if $(this).val() == 'selected-ids-collections'
      $('#collection_ids_chosen').removeClass 'is-hidden'
      $('#all-granules-in-collections').removeClass 'is-hidden'
    else
      $('#collection_ids_chosen').addClass 'is-hidden'
      $('#all-granules-in-collections').addClass 'is-hidden'
    if $(this).val() == 'access-constraint-collections'
      $('#collections-constraint-values').removeClass 'is-hidden'
    else
      $('#collections-constraint-values').addClass 'is-hidden'

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

  # Validate new permissions form
#  if $('.permissions-form').length > 0
  $('.permissions-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false

    errorPlacement: (error, element) ->
      if element.attr('id') == 'search_groups_' || element.attr('id') == 'search_and_order_groups_'
        error.addClass('full-width')
        $table = element.closest('table')
        error.insertAfter($table)
        # element.closest('table').insertAfter(error)
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
      'search_groups[]':
        required:
          # only require one of the two select fields
          require_from_group: [1, '.permission-group']
      'search_and_order_groups[]':
        required:
          # only require one of the two select fields
          require_from_group: [1, '.permission-group']

    messages:
      permission_name:
        required: 'Permission Name is required.'
      collections:
        # we are using the valueNotEquals method, so need to use that message
        valueNotEquals: 'Collection is required.'
      granules:
        # we are using the valueNotEquals method, so need to use that message
        valueNotEquals: 'Granules is required.'
      'search_groups[]':
        required: 'A group is required for Search or Search and Order permissions.'
      'search_and_order_groups[]':
        required: 'A group is required for Search or Search and Order permissions.'

    groups:
      permission_group: 'search_groups[] search_and_order_groups[]'

  # adding a method so the collections and granules default values ('select') are not valid
  $.validator.addMethod 'valueNotEquals', (value, elem, arg) ->
    arg != value
  , 'Selection is required.'

  $('#search_groups_').select2()
  .on 'select2:close', (e) ->
    # adding this to trigger validation of the select2 on close
    # tried to use blur but could not find a right way for that to work with select2
    $(this).valid()

  $('#search_and_order_groups_').select2()
  .on 'select2:close', (e) ->
    # adding this to trigger validation of the select2 on close
    # tried to use blur but could not find a right way for that to work with select2
    $(this).valid()

# errorElement = $('<div/>', {id: "#{id}_error", class: 'eui-banner--danger validation-error', html: 'new message'})
