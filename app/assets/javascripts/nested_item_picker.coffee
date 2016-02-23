# Setup NestedItemPicker for Science Keywords
picker = undefined
@setupScienceKeywords = (data) ->
  picker = new NestedItemPicker('.nested-item-picker', data: data)

$(document).ready ->
  if picker?
    # NestedItemPicker Usage
    # Handle add keyword button
    $('.add-science-keyword').on 'click', ->
      addKeyword 'science'
      resetPicker()
    $('.add-spatial-keyword').on 'click', ->
      addKeyword 'spatial'
      resetPicker()

    addKeyword = (type, keywords = []) ->
      # Add selected value to keyword list
      keywords = picker.getValues() unless keywords.length > 0
      keywordList = $('.selected-' + type + '-keywords ul')
      $.each keywords, (index, value) ->
        matchingKeywords = $(keywordList).find('li').filter ->
          this.childNodes[0].nodeValue.trim() == value
        if matchingKeywords.length == 0 and (value.split('>').length > 2 or type == 'spatial')
            span = "<span class='is-invisible'>Remove #{value}</span>"
            li = $("<li>#{value}<a class='remove'><i class='fa fa-times-circle'></i></a>#{span}</li>")
            $('<input/>',
              type: 'hidden'
              name: 'draft[' + type + '_keywords][]'
              id: 'draft_' + type + '_keywords_'
              value: value).appendTo li
            $(li).appendTo keywordList

    resetPicker = ->
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

    # Science keyword searching
    getKeywords = (json, keyword = []) ->
      keywords = []

      for key, value of json
        if key == 'value'
          keyword.push value
          keywords.push keyword.join(' > ')
        else if $.type(value) == 'object'
          getKeywords(value, keyword)
        else if $.type(value) == 'array'
          for value2 in value
            keywords.push(getKeywords(value2, $.extend([], keyword))) if $.type(value2) == 'object'

      $.map keywords, (keyword) ->
        keyword

    typeaheadSource = new Bloodhound
      datumTokenizer: Bloodhound.tokenizers.nonword,
      queryTokenizer: Bloodhound.tokenizers.nonword,
      local: getKeywords(picker.currentData)

    $('#science-keyword-search').on 'click', ->
      typeaheadSource.clear()
      typeaheadSource.local = getKeywords(picker.currentData)
      typeaheadSource.initialize(true)

      $(this).typeahead(
        hint: false
        highlight: true
        minLength: 1
      ,
        source: typeaheadSource
      )

      this.focus()

    $('li.item, ul.item-path li').on 'click', ->
      typeaheadSource.clear()
      # destroy typeahead
      $('#science-keyword-search').val('')
      $('#science-keyword-search').typeahead('destroy')

    $(document).on 'typeahead:beforeselect', (e, suggestion) ->
      # Add keyword, selected items + suggestion
      selectedValues = picker.getValues()
      keyword = selectedValues.filter (value) ->
        value != ''
      keyword.push(suggestion)
      keyword = [keyword.join(' > ')]

      addKeyword('science', keyword)

      e.preventDefault()
