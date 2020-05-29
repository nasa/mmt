# Setup NestedItemPicker for Science Keywords
picker = undefined
@setupScienceKeywords = (data, options = {}) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', $.extend({}, {data: data, data_type: 'science', keywordLengthMinimum: 3}, options))

@setupServiceKeywords = (data, options = {}) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', $.extend({}, {data: data, data_type: 'service', keywordLengthMinimum: 2}, options))

@setupToolKeywords = (data, options = {}) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', $.extend({}, {data: data, data_type: 'tool', keywordLengthMinimum: 2}, options))

@setupLocationKeywords = (data, options = {}) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', $.extend({}, {data: data, data_type: 'location', keywordLengthMinimum: 2}, options))

preparePickerValidation = (showErrors = true) ->
  # If the item was the last item in the list
  if pickerSelectedList().find('li').length == 0
    # Remove the error from the list at the top of the form
    $('ul li#' + pickerFieldId() + '-top').remove()

    # Remove the error message under the field
    $('#' + pickerFieldId() + '-error').remove()

    # New element that will house the attributes for our required field
    newElement = $('<input type="hidden" />')
    emptyElement = $("#empty_#{pickerFieldId()}")

    # Copy the attributes from our hidden field
    attributes = emptyElement.prop("attributes")

    # Set each of the attributes from our container onto our hidden element
    $.each attributes, () ->
      newElement.attr(this.name, this.value)

    # All the attributes are set as data attributes, pull out the id and name specifically
    newElement.attr('id', emptyElement.data('id'))
    newElement.attr('name', emptyElement.data('name'))

    # Add the validation element within a half-width div (strictly aesthetics)
    pickerSelectedList().append(
      $('<div>').addClass('half-width').html(newElement)
    )

    # Only if asked to, display the errors on the form (not desirable on page load)
    if showErrors
      pickerSelectedList().closest('form').valid()

pickerFieldId = () ->
  "#{picker.options.field_prefix.replace('/', '_')}_#{picker.options.data_type}_keywords"

pickerSelectedList = () ->
  $('.selected-' + picker.options.data_type + '-keywords ul')

$(document).ready ->
  # NestedItemPicker Usage
  if picker?

    # Prepare the picker for validation but dont show the errors on page load
    preparePickerValidation(false)

    # Handle add keyword button
    $('.add-science-keyword').on 'click', ->
      addKeyword 'science'
      resetPicker()

    $('.add-service-keyword').on 'click', ->
      addKeyword 'service'
      resetPicker()

    $('.add-tool-keyword').on 'click', ->
      addKeyword 'tool'
      resetPicker()

    $('.add-location-keyword').on 'click', ->
      addKeyword 'location'
      resetPicker()

    addKeyword = (type, keywords = []) ->
      # Add selected value to keyword list
      keywords = picker.getValues() unless keywords.length > 0
      keywordList = pickerSelectedList()

      fieldPrefixName = $.map picker.options.field_prefix.split('/'), (d, i) ->
        if i > 0
          '[' + d + ']'
        else
          d
      .join('')

      fieldPrefixId = picker.options.field_prefix.replace('/', '_')
      scienceKeywordFields = ['category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3', 'detailed_variable']
      serviceKeywordFields = ['service_category', 'service_topic', 'service_term', 'service_specific_term']
      ToolKeywordFields = ['tool_category', 'tool_topic', 'tool_term', 'tool_specific_term']
      locationKeywordFields = ['category', 'type', 'subregion_1', 'subregion_2', 'subregion_3', 'detailed_location']

      keywordFields = switch picker.options.data_type
        when 'science' then scienceKeywordFields
        when 'service' then serviceKeywordFields
        when 'tool' then ToolKeywordFields
        when 'location' then locationKeywordFields

      timeStamp = Date.now()
      $.each keywords, (index, value) ->
        timeStamp += 1
        matchingKeywords = $(keywordList).find('li').filter ->
          this.childNodes[0].nodeValue.trim() == value
        if matchingKeywords.length == 0 and value.split('>').length >= picker.options.keywordLengthMinimum
            span = "<span class='is-invisible'>Remove #{value}</span>"
            li = $("<li>#{value}<a class='remove' data-keyword-type='#{type}' data-field-prefix-id='#{fieldPrefixId}'><i class='fa fa-times-circle'></i></a>#{span}</li>")

            keyword_pieces = value.split(' > ')
            for keyword, i in keyword_pieces
              $('<input/>',
                type: 'hidden'
                name: "#{fieldPrefixName}[#{type}_keywords][#{timeStamp}][#{keywordFields[i]}]"
                id: "#{fieldPrefixId}_#{type}_keywords_#{timeStamp}_#{keywordFields[i]}"
                value: keyword).appendTo li

            $(li).appendTo keywordList

          # Look for the element responsible for holding onto validation information for this field
          emptyFieldForValidation = $(this).find("##{fieldPrefixId}_#{type}_keywords")

          # If we find it
          if emptyFieldForValidation
            # Remove the element from the DOM
            $("##{fieldPrefixId}_#{type}_keywords").parent().remove()

            # Revalidate the form (will remove errors associated with this field)
            keywordList.closest('form').valid()

    resetPicker = ->
      # Reset picker to top level
      $('.add-science-keyword, .add-service-keyword, .add-tool-keyword, .add-location-keyword').attr 'disabled', 'true'
      picker.resetPicker()

    $('.selected-science-keywords, .selected-service-keywords, .selected-tool-keywords, .selected-location-keywords').on 'click', '.remove', ->
      # The item being removed
      keywordsListItem = $(this).parent()

      # The list the item belongs to
      keywordsList = keywordsListItem.closest('ul')

      # Remove the item per the users request
      keywordsListItem.remove()

      # Validates the picker
      preparePickerValidation()

    # Functions to validate user's ability to add keywords
    # Validate when user clicks on on item selection
    checkSelectionLevel = ->
      selectionLevel = $('.eui-item-path li').length

      # science keywords must be at least 3 levels deep, location keywords 2
      if selectionLevel > picker.options.keywordLengthMinimum
        $('.add-science-keyword, .add-service-keyword, .add-tool-keyword, .add-location-keyword').removeAttr 'disabled'
      else
        $('.add-science-keyword, .add-service-keyword, .add-tool-keyword, .add-location-keyword').attr 'disabled', true

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
        $('.add-science-keyword, .add-service-keyword, .add-tool_keyword, .add-location-keyword').removeAttr 'disabled'
      else if $('.eui-item-path li').length < selectionLowerBound
        $('.add-science-keyword, .add-service-keyword, .add-tool-keyword, .add-location-keyword').attr 'disabled', true

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

    $('#science-keyword-search, #service-keyword-search, #tool-keyword-search, #location-keyword-search').on 'click', ->
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
      $('#science-keyword-search, #service-keyword-search, #tool-keyword-search, #location-keyword-search').val('')
      $('#science-keyword-search, #service-keyword-search, #tool-keyword-search, #location-keyword-search').typeahead('destroy')

    $(document).on 'typeahead:beforeselect', (e, suggestion) ->
      # Add keyword, selected items + suggestion
      keyword = picker.getParents()

      # prevent adding final option twice (when it is selected and also searched for)
      keyword.push(suggestion) unless suggestion == keyword[keyword.length - 1]

      keyword = [keyword.join(' > ')]
      if picker.options.data_type == 'science'
        addKeyword('science', keyword)
      else if picker.options.data_type == 'service'
        addKeyword('service', keyword)
      else if picker.options.data_type == 'tool'
        addKeyword('tool', keyword)
      else if picker.options.data_type == 'location'
        addKeyword('location', keyword)

      e.preventDefault()
