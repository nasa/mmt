# Setup NestedItemPicker for Science Keywords
picker = undefined
@setupScienceKeywords = (data) ->
  picker = new NestedItemPicker('.nested-item-picker', data: data)

$(document).ready ->
  # NestedItemPicker Usage
  # Handle add keyword button
  $('.add-science-keyword').on 'click', ->
    addKeyword 'science'
  $('.add-spatial-keyword').on 'click', ->
    addKeyword 'spatial'

  addKeyword = (type) ->
    # Add selected value to keyword list
    values = picker.getValues()
    keywordList = $('.selected-' + type + '-keywords ul')
    $.each values, (index, value) ->
      li = $('<li>' + value + '<a class=\'remove\'><i class=\'fa fa-times-circle\'></i></a></li>')
      $('<input/>',
        type: 'hidden'
        name: 'draft[' + type + '_keywords][]'
        id: 'draft_' + type + '_keywords_'
        value: value).appendTo li
      $(li).appendTo keywordList

    # Reset picker to top level
    $('.add-science-keyword').attr 'disabled', 'true'
    picker.resetPicker()

  $('.selected-science-keywords, .selected-spatial-keywords').on 'click', '.remove', ->
    $(this).parent().remove()

  # Functions to validate user's ability to add keywords
  # Validate when user clicks on on item selection
  checkSelectionLevel = ->
    selectionLevel = $('.item-path li').length
    if selectionLevel > 3
      $('.add-science-keyword').removeAttr 'disabled'
    else
      $('.add-science-keyword').attr 'disabled', true

  $('div.nested-item-picker').on 'click', '.item-parent', ->
    checkSelectionLevel()

  # Validate when user uses side navigation
  $('.item-path').on 'click', 'li', ->
    checkSelectionLevel()

  # Validate if user select final option
  $('.nested-item-picker').on 'click', '.final-option', ->
    $this = $(this)
    if $this.hasClass('final-option-selected')
      $('.add-science-keyword').removeAttr 'disabled'
    else if $('.item-path li').length < 4
      $('.add-science-keyword').attr 'disabled', true
