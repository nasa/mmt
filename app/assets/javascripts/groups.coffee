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
