# Override default resetPicker function
@NestedItemPicker::resetPicker = ->
  @$element.find('.item-path > li.list-title').click()
  @updateList()
  $('.add-science-keyword').attr 'disabled', 'true'
  return

# Functions to validate user's ability to add keywords
$(document).ready ->
  # Validate when user clicks on on item selection

  checkSelectionLevel = ->
    selectionLevel = $('.item-path li').length
    if selectionLevel > 3
      $('.add-science-keyword').removeAttr 'disabled'
    else
      $('.add-science-keyword').attr 'disabled', true
    return

  $('div.nested-item-picker').on 'click', '.item-parent', ->
    checkSelectionLevel()
    return
  # Validate when user uses side navigation
  $('.item-path').on 'click', 'li', ->
    checkSelectionLevel()
    return
  # Validate if user select final option
  $('.nested-item-picker').on 'click', '.final-option', ->
    $this = $(this)
    if $this.hasClass('final-option-selected')
      $('.add-science-keyword').removeAttr 'disabled'
    else if $('.item-path li').length < 4
      $('.add-science-keyword').attr 'disabled', true
    return
  return