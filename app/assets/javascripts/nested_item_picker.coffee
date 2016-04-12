# Setup NestedItemPicker for Science Keywords
picker = undefined
@setupScienceKeywords = (data) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', data: data, data_type: 'science')

@setupSpatialKeywords = (data) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', data: data, data_type: 'spatial')

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
      $('.add-science-keyword, .add-spatial-keyword').attr 'disabled', 'true'
      picker.resetPicker()

    $('.selected-science-keywords, .selected-spatial-keywords').on 'click', '.remove', ->
      $(this).parent().remove()

    # Functions to validate user's ability to add keywords
    # Validate when user clicks on on item selection
    checkSelectionLevel = ->
      selectionLevel = $('.eui-item-path li').length
      if selectionLevel > 3
        $('.add-science-keyword, .add-spatial-keyword').removeAttr 'disabled'
      else
        $('.add-science-keyword, .add-spatial-keyword').attr 'disabled', true

    $('div.eui-nested-item-picker').on 'click', '.item-parent', ->
      checkSelectionLevel()

    # Validate when user uses side navigation
    $('.eui-item-path').on 'click', 'li', ->
      checkSelectionLevel()

    # Validate if user select final option
    $('.eui-nested-item-picker').on 'click', '.final-option', ->
      $this = $(this)
      if $this.hasClass('final-option-selected')
        $('.add-science-keyword, .add-spatial-keyword').removeAttr 'disabled'
      else if $('.eui-item-path li').length < 4
        $('.add-science-keyword, .add-spatial-keyword').attr 'disabled', true

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

      keywords = $.map keywords, (keyword) ->
        keyword

      selectedValues = picker.getValues()[0]
      numberSelectedValues = selectedValues.split('>').filter (value) ->
        value != ''

      keywords.filter (keyword) ->
        keyword if keyword.split('>').length > 2 - numberSelectedValues.length

    typeaheadSource = new Bloodhound
      datumTokenizer: Bloodhound.tokenizers.nonword,
      queryTokenizer: Bloodhound.tokenizers.nonword,
      local: getKeywords(picker.currentData)

    $('#science-keyword-search, #spatial-keyword-search').on 'click', ->
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

    $(document).on 'click', 'li.item a, ul.eui-item-path li', ->
      typeaheadSource.clear()
      # destroy typeahead
      $('#science-keyword-search, #spatial-keyword-search').val('')
      $('#science-keyword-search, #spatial-keyword-search').typeahead('destroy')

    $(document).on 'typeahead:beforeselect', (e, suggestion) ->
      # Add keyword, selected items + suggestion
      selectedValues = picker.getValues()
      keyword = selectedValues.filter (value) ->
        value != ''
      keyword.push(suggestion)
      keyword = [keyword.join(' > ')]

      if picker.options.data_type == 'science'
        addKeyword('science', keyword)
      else if picker.options.data_type == 'spatial'
        addKeyword('spatial', keyword)

      e.preventDefault()
