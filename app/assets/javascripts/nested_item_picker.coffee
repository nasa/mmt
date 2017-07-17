# Setup NestedItemPicker for Science Keywords
picker = undefined
@setupScienceKeywords = (data, options = {}) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', $.extend({}, {data: data, data_type: 'science'}, options))

@setupLocationKeywords = (data, options = {}) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', data: data, data_type: 'location')

$(document).ready ->
  if picker?
    # NestedItemPicker Usage
    # Handle add keyword button
    $('.add-science-keyword').on 'click', ->
      addKeyword 'science'
      resetPicker()
    $('.add-location-keyword').on 'click', ->
      addKeyword 'location'
      resetPicker()

    addKeyword = (type, keywords = []) ->
      # Add selected value to keyword list
      keywords = picker.getValues() unless keywords.length > 0
      keywordList = $('.selected-' + type + '-keywords ul')

      fieldPrefixName = $.map picker.options.field_prefix.split('/'), (d, i) ->
        if i > 0
          '[' + d + ']'
        else
          d
      .join('')

      fieldPrefixId = picker.options.field_prefix.replace('/', '_')
      scienceKeywordFields = ['catagory', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3', 'detailed_variable']
      locationKeywordFields = ['catagory', 'type', 'subregion_1', 'subregion_2', 'subregion_3', 'detailed_location']

      keywordFields = if picker.data_type == 'science' then scienceKeywordFields else locationKeywordFields

      $.each keywords, (index, value) ->
        matchingKeywords = $(keywordList).find('li').filter ->
          this.childNodes[0].nodeValue.trim() == value
        keywordLengthMinimum = if picker.options.data_type == 'science' then 2 else 1
        if matchingKeywords.length == 0 and value.split('>').length > keywordLengthMinimum
            span = "<span class='is-invisible'>Remove #{value}</span>"
            li = $("<li>#{value}<a class='remove'><i class='fa fa-times-circle'></i></a>#{span}</li>")

            keyword_pieces = value.split(' > ')
            timeStamp = Date.now()
            for keyword, i in keyword_pieces
              $('<input/>',
                type: 'hidden'
                name: "#{fieldPrefixName}[#{type}_keywords][#{timeStamp}][#{keywordFields[i]}]"
                id: "#{fieldPrefixId}_#{type}_keywords_#{timeStamp}_#{keywordFields[i]}"
                value: keyword).appendTo li
            $(li).appendTo keywordList

    resetPicker = ->
      # Reset picker to top level
      $('.add-science-keyword, .add-location-keyword').attr 'disabled', 'true'
      picker.resetPicker()

    $('.selected-science-keywords, .selected-location-keywords').on 'click', '.remove', ->
      $(this).parent().remove()

    # Functions to validate user's ability to add keywords
    # Validate when user clicks on on item selection
    checkSelectionLevel = ->
      selectionLevel = $('.eui-item-path li').length

      # science keywords must be at least 3 levels deep, location keywords 2
      selectionMinimum = if picker.options.data_type == 'science' then 3 else 2
      if selectionLevel > selectionMinimum
        $('.add-science-keyword, .add-location-keyword').removeAttr 'disabled'
      else
        $('.add-science-keyword, .add-location-keyword').attr 'disabled', true

    $('div.eui-nested-item-picker').on 'click', '.item-parent', ->
      checkSelectionLevel()

    # Validate when user uses side navigation
    $('.eui-item-path').on 'click', 'li', ->
      checkSelectionLevel()

    # Validate if user select final option
    $('.eui-nested-item-picker').on 'click', '.final-option', ->
      $this = $(this)

      # science keywords must be at least 3 levels deep, location keywords 2
      selectionLowerBound = if picker.options.data_type == 'science' then 4 else 3
      if $this.hasClass('final-option-selected')
        $('.add-science-keyword, .add-location-keyword').removeAttr 'disabled'
      else if $('.eui-item-path li').length < selectionLowerBound
        $('.add-science-keyword, .add-location-keyword').attr 'disabled', true

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
        keywordLevelMinimum = if picker.options.data_type == 'science' then 2 else 1
        keyword if keyword.split('>').length > keywordLevelMinimum - numberSelectedValues.length

    typeaheadSource = new Bloodhound
      datumTokenizer: Bloodhound.tokenizers.nonword,
      queryTokenizer: Bloodhound.tokenizers.nonword,
      local: getKeywords(picker.currentData)

    $('#science-keyword-search, #location-keyword-search').on 'click', ->
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
      $('#science-keyword-search, #location-keyword-search').val('')
      $('#science-keyword-search, #location-keyword-search').typeahead('destroy')

    $(document).on 'typeahead:beforeselect', (e, suggestion) ->
      # Add keyword, selected items + suggestion
      keyword = picker.getParents()

      # prevent adding final option twice (when it is selected and also searched for)
      keyword.push(suggestion) unless suggestion == keyword[keyword.length - 1]

      keyword = [keyword.join(' > ')]
      if picker.options.data_type == 'science'

        addKeyword('science', keyword)
      else if picker.options.data_type == 'location'
        addKeyword('location', keyword)

      e.preventDefault()
