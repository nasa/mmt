# Setup NestedItemPicker for Science Keywords
picker = undefined
sciencePicker = undefined
locationPicker = undefined
@setupBulkEditScienceKeywords = (data) ->
  sciencePicker = new NestedItemPicker('.eui-nested-item-picker.science-keywords-picker', data: data, max_selections: 1, data_type: 'science', keywordLengthMinimum: 3)
  picker = sciencePicker

@setupBulkEditLocationKeywords = (data) ->
  locationPicker = new NestedItemPicker('.eui-nested-item-picker.location-keywords-picker', data: data, max_selections: 1, data_type: 'location', keywordLengthMinimum: 2)

$(document).ready ->
  $('#update_field').on 'change', ->
    if $(this).val() == 'science_keywords'
      picker = sciencePicker
    else if $(this).val() == 'location_keywords'
      picker = locationPicker

  if picker?
    selectKeyword = (type, keywords = []) ->
      $("#new-#{type}-keyword-container").slideDown 300, ->
        $("#new-#{type}-keyword-container").removeClass('is-hidden')
      addKeyword(type, keywords)
      resetPicker()

    # Handle the `Select Keyword` button
    $('.select-science-keyword').on 'click', ->
      selectKeyword('science')

    # Handle the `Select Keyword` button
    $('.select-location-keyword').on 'click', ->
      selectKeyword('location')

    addKeyword = (type, keywords = []) ->
      # Add selected value to keyword list
      keywords = picker.getValues() unless keywords.length > 0

      $.each keywords, (index, value) ->
        splitKeywords = value.split('>')

        if splitKeywords.length >= picker.options.keywordLengthMinimum
          scienceKeywordFields = ['category', 'topic', 'term', 'variablelevel1', 'variablelevel2', 'variablelevel3', 'detailedvariable']
          locationKeywordFields = ['location_category', 'type', 'subregion_1', 'subregion_2', 'subregion_3', 'detailed_location']

          fieldsToPopulate = if type == 'science' then scienceKeywordFields else locationKeywordFields

          $.each fieldsToPopulate, (index, value) ->
            $("#new-#{type}-keyword-container #new_#{value}").val('')

          $.each splitKeywords, (index, value) ->
            $("#new-#{type}-keyword-container #new_#{fieldsToPopulate[index]}").val(value.trim())
            $("#new-#{type}-keyword-container #new_#{fieldsToPopulate[index]}").trigger 'change'

    resetPicker = ->
      # Reset picker to top level
      $('.select-science-keyword, .select-location-keyword').attr 'disabled', true
      picker.resetPicker()

    # Functions to validate user's ability to add keywords
    # Validate when user clicks on on item selection
    checkSelectionLevel = ->
      type = picker.options.data_type
      selectionLevel = $(".#{type}-keywords-picker .eui-item-path li").length

      # science keywords must be at least 3 levels deep
      if selectionLevel > picker.options.keywordLengthMinimum
        $('.select-science-keyword, .select-location-keyword').removeAttr 'disabled'
      else
        $('.select-science-keyword, .select-location-keyword').attr 'disabled', true

    $('div.eui-nested-item-picker').on 'click', '.item-parent', ->
      checkSelectionLevel()

    # Validate when user uses side navigation
    $('.eui-item-path').on 'click', 'li', ->
      checkSelectionLevel()

    # Validate if user select final option
    $('.eui-nested-item-picker').on 'click', '.final-option', ->
      $this = $(this)

      if $('.final-option-selected').length > picker.options.max_selections
        $this.removeClass('final-option-selected')
      else
        # science keywords must be at least 3 levels deep
        selectionLowerBound = if picker.options.data_type == 'science' then 4 else 3
        if $this.hasClass('final-option-selected')
          $('.select-science-keyword, .select-location-keyword').removeAttr 'disabled'
        else if $('.eui-item-path li').length < selectionLowerBound
          $('.select-science-keyword, .select-location-keyword').attr 'disabled', true

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
        keywordLevelMinimum = 2
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

      selectKeyword(picker.options.data_type, keyword)

      e.preventDefault()

isFindVisibleAndVisited = ->
  $("#bulk-update-form-#{picker.options.data_type}_keywords .bulk-updates-find").is(':visible') && $("#bulk-update-form-#{picker.options.data_type}_keywords .bulk-updates-find").hasClass('visited')

areOtherFindValuesEmpty = (findInput) ->
  otherValues = []
  $(".#{picker.options.data_type}-keyword-find").each (index, element) ->
    if element != findInput
      otherValues.push($(element).val())
  validValues = otherValues.filter (values) ->
    values != ''
  validValues.length == 0

isValueVisibleAndVisited = ->
  $("#bulk-update-form-#{picker.options.data_type}_keywords .bulk-updates-value").is(':visible') && $("#bulk-update-form-#{picker.options.data_type}_keywords .bulk-updates-value").hasClass('visited')

hideAndClear = (selector) ->
  $(selector).addClass('is-hidden')
  $(selector).removeClass('visited')
  $(selector + ' input').val('')
  $(selector + ' input').prop('disabled', true)
  $(selector + ' select').prop('disabled', true)

showField = (selector) ->
  $(selector).removeClass('is-hidden')
  $(selector + ' input').prop('disabled', false)
  $(selector + ' select').prop('disabled', false)
  $('.eui-item-path > li.list-title:visible').click()


  # TODO use a class to hide these types of elements
  # if selector == '# .bulk-updates-value'
  #   $('#new-keyword-container').addClass('is-hidden')
  #   # this seems redundant but is necessary to hide the fields again, possibly because of using slideDown
  #   $('#new-keyword-container').hide()

$(document).ready ->
  # bulk updates new form
  if $('#bulk-updates-form').length > 0
    validator = $('#bulk-updates-form').validate
      ignore: ':hidden:not(.science-keyword-value, .location-keyword-value)'
      onkeyup: false

      rules:
        'update_field':
          required: true
        'update_type':
          required: true
        'find_value[Category]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[Topic]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[Term]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[VariableLevel1]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[VariableLevel2]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[VariableLevel3]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[DetailedVariable]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[LocationCategory]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[Type]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[Subregion1]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[Subregion2]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[Subregion3]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'find_value[DetailedLocation]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        # only the top 3 levels are required for a valid science keyword
        'update_value[Category]':
          required:
            depends: ->
              isValueVisibleAndVisited()
        'update_value[Topic]':
          required:
            depends: ->
              isValueVisibleAndVisited()
        'update_value[Term]':
          required:
            depends: ->
              isValueVisibleAndVisited()
        # only the top 2 levels are required for a valid location keyword
        'update_value[LocationCategory]':
          required:
            depends: ->
              isValueVisibleAndVisited()
        'update_value[Type]':
          required:
            depends: ->
              isValueVisibleAndVisited()

      messages:
        'update_field':
          required: 'Update Field is required.'
        'update_type':
          required: 'Update Type is required.'
        'find_value[Category]':
          required: 'At least one keyword level must be specified.'
        'find_value[Topic]':
          required: 'At least one keyword level must be specified.'
        'find_value[Term]':
          required: 'At least one keyword level must be specified.'
        'find_value[VariableLevel1]':
          required: 'At least one keyword level must be specified.'
        'find_value[VariableLevel2]':
          required: 'At least one keyword level must be specified.'
        'find_value[VariableLevel3]':
          required: 'At least one keyword level must be specified.'
        'find_value[DetailedVariable]':
          required: 'At least one keyword level must be specified.'
        'find_value[LocationCategory]':
          required: 'At least one keyword level must be specified.'
        'find_value[Type]':
          required: 'At least one keyword level must be specified.'
        'find_value[Subregion1]':
          required: 'At least one keyword level must be specified.'
        'find_value[Subregion2]':
          required: 'At least one keyword level must be specified.'
        'find_value[Subregion3]':
          required: 'At least one keyword level must be specified.'
        'find_value[DetailedLocation]':
          required: 'At least one keyword level must be specified.'
        # only the top 3 levels are required for a valid science keyword
        'update_value[Category]':
          required: 'A valid science keyword must be specified.'
        'update_value[Topic]':
          required: 'A valid science keyword must be specified.'
        'update_value[Term]':
          required: 'A valid science keyword must be specified.'
        # only the top 2 levels are required for a valid location keyword
        'update_value[LocationCategory]':
          required: 'A valid science keyword must be specified.'
        'update_value[Type]':
          required: 'A valid science keyword must be specified.'

      groups:
        # Show only one message for each group
        science_keyword_find: 'find_value[Category] find_value[Topic] find_value[Term] find_value[VariableLevel1] find_value[VariableLevel2] find_value[VariableLevel3] find_value[DetailedVariable]'
        location_keyword_find: 'find_value[LocationCategory] find_value[Type] find_value[Subregion1] find_value[Subregion2] find_value[Subregion3] find_value[DetailedLocation]'
        science_keyword_value: 'update_value[Category] update_value[Topic] update_value[Term]'
        location_keyword_value:'update_value[LocationCategory] update_value[Type]'

      errorPlacement: (error, element) ->
        if element.hasClass('science-keyword-find')
          $('#bulk-update-form-science_keywords .bulk-updates-find').append(error)
        else if element.hasClass('science-keyword-value')
          $('#bulk-update-form-science_keywords .bulk-updates-value').append(error)
        else if element.hasClass('location-keyword-find')
          $('#bulk-update-form-location_keywords .bulk-updates-find').append(error)
        else if element.hasClass('location-keyword-value')
          $('#bulk-update-form-location_keywords .bulk-updates-value').append(error)
        else
          error.insertAfter(element)

    # Handle the hiding and showing of the appropriate form
    # partial for the collection field being updated
    $('#update_field').on 'change', ->
      #-- RESET ALL THE THINGS
      # Triggering the `change` event here will reset the specific field
      $('select[name=update_type]').val('').trigger('change')

      # Clear all validation
      validator.resetForm()

      # Hide all partials
      $('.bulk-update-partial').addClass('is-hidden')
      hideAndClear('.bulk-update-partial')

      # Show only the partial being requested
      showField('#bulk-update-form-' + $(this).val())

    # Show and hide update type specific divs
    $('select[name=update_type]').on 'change', ->
      $update_field = $('#update_field').val()
      $update_field_selector = '#bulk-update-form-' + $update_field

      if $(this).val() == ''
        # The prompt was selected, hide both parts of the science keyword form
        hideAndClear($update_field_selector + ' .bulk-updates-value')
        hideAndClear($update_field_selector + ' .bulk-updates-find')

        # Re-validate the form to remove any validation errors from the parts we are hiding
        validator.form()
      else
        # Toggle display of the 'Record Search'
        if $(this).val() == 'FIND_AND_REMOVE' || $(this).val() == 'FIND_AND_REPLACE' || $(this).val() == 'FIND_AND_UPDATE'
          showField($update_field_selector + ' .bulk-updates-find')
        else
          hideAndClear($update_field_selector + ' .bulk-updates-find')

          # Re-validate the form to remove any validation errors from the parts we are hiding
          validator.form()

        # Toggle display of the field specific form widget
        if $(this).val() == 'FIND_AND_REMOVE'
          hideAndClear($update_field_selector + ' .bulk-updates-value')
        else
          showField($update_field_selector + ' .bulk-updates-value')

        # Handle the title and form description
        $selectedFieldData = $($update_field_selector + ' #update_type').find('option:selected').data()

        if $selectedFieldData.hasOwnProperty('find_title')
          $($update_field_selector + ' .bulk-updates-find h4.title:first').text($selectedFieldData['find_title'])
        if $selectedFieldData.hasOwnProperty('find_description')
          $($update_field_selector + ' .bulk-updates-find p.form-description:first').text($selectedFieldData['find_description'])

        if $selectedFieldData.hasOwnProperty('new_title')
          $($update_field_selector + ' .bulk-updates-value h4.title:first').text($selectedFieldData['new_title'])
        if $selectedFieldData.hasOwnProperty('new_description')
          $($update_field_selector + ' .bulk-updates-value p.form-description:first').text($selectedFieldData['new_description'])

    # mark bulk update find container for science keywords as visited because
    # we only want to validate the fields if they have been visited
    $('.science-keyword-find, .location-keyword-find').on 'blur', ->
      $("#bulk-update-form-#{picker.options.data_type}_keywords .bulk-updates-find").addClass('visited')
      $(this).valid()

    # mark the nested item picker as visited when any of the options are clicked
    # because we only want to validate the selected keyword values if it has been visited
    $('.eui-item-path, .eui-item-list-pane').on 'click', ->
      $("#bulk-update-form-#{picker.options.data_type}_keywords .bulk-updates-value").addClass('visited')

    $('.science-keyword-value, .location-keyword-value').on 'change', ->
      $(this).valid()

    # mark appropriate containers as visited before submitting to ensure validation
    $('#bulk-update-preview-button').on 'click', (e) ->
      $("#bulk-update-form-#{picker.options.data_type}_keywords .bulk-updates-find, #bulk-update-form-#{picker.options.data_type}_keywords .bulk-updates-value").addClass('visited')

  if $('#bulk-update-status-table').length > 0
    $('#bulk-update-status-table').tablesorter
      sortList: [[0,0]]

      # Prevent sorting on the checkboxes
      headers:
        2:
          sorter: false

      widgets: ['zebra']
