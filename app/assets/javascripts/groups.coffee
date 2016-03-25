users = undefined
@saveUsersForGroups = (data) ->
  users = data

$(document).ready ->
  $('#select_all_members').on 'change', ->
    if this.checked
      $('.remove-member-checkbox').prop 'checked', true
    else
      $('.remove-member-checkbox').prop 'checked', false
    updateRemoveButton()

  $('.remove-member-checkbox').on 'change', ->
    updateRemoveButton()

  updateRemoveButton = ->
    # if any checkboxes are selected, enable button
    if $('.remove-member-checkbox:checked').length > 0
      $('#remove-selected-members').prop 'disabled', false
      $('#remove-selected-members').removeClass 'disabled'
    else
      # else disable button
      $('#remove-selected-members').prop 'disabled', true
      $('#remove-selected-members').addClass 'disabled'

  $('#remove-selected-members').on 'click', ->
    if !$(this).hasClass('disabled')
      $(this).parents('form').submit()


  # Typeahead for group filtering
  typeaheadSource = new Bloodhound
    datumTokenizer: Bloodhound.tokenizers.nonword,
    queryTokenizer: Bloodhound.tokenizers.nonword,
    local: users

  $('#filters_member').typeahead(
    hint: true
    highlight: true
    minLength: 1
  ,
    source: typeaheadSource
  )
