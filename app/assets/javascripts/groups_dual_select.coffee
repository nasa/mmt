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

    if $('#members_directory option:selected').length > 0
      $('#selected_members').append $('#members_directory option:selected')
      $('#selected_members option:selected').attr 'selected', false

  # removing members from selected_members box, move back to members_directory
  $('#remove-members').on 'click', (e) ->
    e.preventDefault()

    if $('#selected_members option:selected').length > 0
      $('#members_directory').append $('#selected_members option:selected')
      $('#members_directory option:selected').attr 'selected', false

      sortedOptions = sortList($('#members_directory option'))
      $('#members_directory').empty().append sortedOptions

  $('#new-group-submit').on 'click', (e) ->
    $('#selected_members option').prop 'selected', true

  # Filtering users
  $holdSelect = $("<select>").attr('id', 'members_directory_hold')
  $holdSelect.hide()
  $('.group-form').append($holdSelect)

  $('#filter-members').on 'input', ->
    $selectListOptions = $('#members_directory option')
    $holdSelectListOptions = $('#members_directory_hold option')

    # get filterText
    filterText = this.value.toLowerCase()

    # for each option, if text or value does not match filterText, move it
    for option in $selectListOptions
      value = option.value.toLowerCase()
      text = option.text.toLowerCase()

      if !(value.match(filterText) || text.match(filterText))
        $(option).appendTo("#members_directory_hold")

    # for each option, if text or value DOES match filterText, move it back
    for option in $holdSelectListOptions
      value = option.value.toLowerCase()
      text = option.text.toLowerCase()

      if value.match(filterText) || text.match(filterText)
        $(option).appendTo("#members_directory")
      else
