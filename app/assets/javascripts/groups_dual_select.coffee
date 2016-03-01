$(document).ready ->

  sortList = (optionsList) ->
    sorted = optionsList.sort (a, b) ->
      if a.text.toLowerCase() > b.text.toLowerCase()
        1
      else if a.text.toLowerCase() < b.text.toLowerCase()
        -1
      else
        0

  # moving members from members_directory to selected_members box
  $('#add-members').on 'click', (e) ->
    e.preventDefault()

    if ($('#members_directory option:selected').length > 0)
      $('#selected_members').append $('#members_directory option:selected')
      $('#selected_members option:selected').attr 'selected', false

      sortedOptions = sortList($('#members_directory option'))
      $('#members_directory').empty().append sortedOptions #sortList($('#members_directory option'))

  # removing members from selected_members box, move back to members_directory
  $('#remove-members').on 'click', (e) ->
    e.preventDefault()

    if $('#selected_members option:selected').length > 0
      $('#members_directory').append $('#selected_members option:selected')
      $('#members_directory option:selected').attr 'selected', false

      sortedOptions = sortList($('#members_directory option'))
      $('#members_directory').empty().append sortedOptions #sortList($('#members_directory option'))

  $('#new-group-submit').one 'click', (e) ->
    e.preventDefault()
    if $('#selected_members option').length > 0
      $('#selected_members option').attr 'selected', true

    $(this).trigger 'click'
