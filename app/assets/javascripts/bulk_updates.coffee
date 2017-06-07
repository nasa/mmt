# Setup NestedItemPicker for Science Keywords
picker = undefined
@setupBulkEditScienceKeywords = (data) ->
  picker = new NestedItemPicker('.eui-nested-item-picker', data: data, max_selections: 1)

$(document).ready ->
  if picker?
    selectKeyword = (keywords = []) ->
      $('#new-keyword-container').slideDown 300, ->
        $('#new-keyword-container').removeClass('is-hidden')
      addKeyword(keywords)
      picker.resetPicker()

    # Handle the `Select Keyword` button
    $('.select-science-keyword').on 'click', ->
      selectKeyword()

    addKeyword = (keywords = []) ->
      # Add selected value to keyword list
      keywords = picker.getValues() unless keywords.length > 0

      # keywordList = $('.selected-science-keywords ul')
      $.each keywords, (index, value) ->
        splitKeywords = value.split('>')

        # matchingKeywords = $(keywordList).find('li').filter ->
        #   this.childNodes[0].nodeValue.trim() == value
        keywordLengthMinimum = 2
        if splitKeywords.length > keywordLengthMinimum
          fieldsToPopulate = ['category', 'topic', 'term', 'variablelevel1', 'variablelevel2', 'variablelevel3', 'detailedvariable']

          $.each fieldsToPopulate, (index, value) ->
            $('#new_' + value).val('')

          $.each splitKeywords, (index, value) ->
            $('#new_' + fieldsToPopulate[index]).val(value.trim())
            $('#new_' + fieldsToPopulate[index]).trigger 'change'

    resetPicker = ->
      # Reset picker to top level
      $('.select-science-keyword').attr 'disabled', true
      picker.resetPicker()

    $('.selected-science-keywords').on 'click', '.remove', ->

    # Functions to validate user's ability to add keywords
    # Validate when user clicks on on item selection
    checkSelectionLevel = ->
      selectionLevel = $('.eui-item-path li').length

      # science keywords must be at least 3 levels deep
      selectionMinimum = 3
      if selectionLevel > selectionMinimum
        $('.select-science-keyword').removeAttr 'disabled'
      else
        $('.select-science-keyword').attr 'disabled', true

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
        selectionLowerBound = 4
        if $this.hasClass('final-option-selected')
          $('.select-science-keyword').removeAttr 'disabled'
        else if $('.eui-item-path li').length < selectionLowerBound
          $('.select-science-keyword').attr 'disabled', true

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

    $(document).on 'click', 'li.item a, ul.eui-item-path li', ->
      typeaheadSource.clear()
      # destroy typeahead
      $('#science-keyword-search').val('')
      $('#science-keyword-search').typeahead('destroy')

    $(document).on 'typeahead:beforeselect', (e, suggestion) ->
      # Add keyword, selected items + suggestion
      keyword = picker.getParents()

      # prevent adding final option twice (when it is selected and also searched for)
      keyword.push(suggestion) unless suggestion == keyword[keyword.length - 1]

      keyword = [keyword.join(' > ')]

      # addKeyword(keyword)
      selectKeyword(keyword)

      e.preventDefault()

displayHelpText = (searchFieldElement) ->
  # The select element that lists the fields to search on
  $selectedFieldData = searchFieldElement.find('option:selected').data()

  # The query (value) field and its form-description
  $queryField = searchFieldElement.closest('div').find('#bulk-updates-search-field')
  $queryFieldDescription = $('#bulk-update-query-description')

  # Set the form-description if the field has one
  if($selectedFieldData.hasOwnProperty('description'))
    $queryFieldDescription.text($selectedFieldData['description'])
  else
    $queryFieldDescription.text('')

  searchFieldElement.next('.form-description').remove()

  if($selectedFieldData.hasOwnProperty('supports_wildcard') && $selectedFieldData['supports_wildcard'] == true)
    $('<p>').addClass('form-description')
      .text('This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.')
      .insertAfter($queryField)

isFindVisibleAndVisited = ->
  $('#bulk-updates-find').is(':visible') && $('#bulk-updates-find').hasClass('visited')

areOtherFindValuesEmpty = (findInput) ->
  otherValues = []
  $('.science-keyword-find').each (index, element) ->
    if element != findInput
      otherValues.push($(element).val())
  validValues = otherValues.filter (values) ->
    values != ''
  validValues.length == 0

isValueVisibleAndVisited = ->
  $('#bulk-updates-value').is(':visible') && $('#bulk-updates-value').hasClass('visited')

hideAndClear = (id) ->
  $('#' + id).addClass('is-hidden')
  $('#' + id).removeClass('visited')
  $('#' + id + ' input').val('')
  if id == 'bulk-updates-value'
    $('#new-keyword-container').addClass('is-hidden')
    # this seems redundant but is necessary to hide the fields again, possibly because of using slideDown
    $('#new-keyword-container').hide()

$(document).ready ->
  # bulk updates new form
  if $('#bulk-updates-form').length > 0
    validator = $('#bulk-updates-form').validate
      ignore: ':hidden:not(.science-keyword-value)'
      onkeyup: false

      rules:
        'update_field':
          required: true
        'update_type':
          required: true
        'bulk_update_find[Category]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'bulk_update_find[Topic]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'bulk_update_find[Term]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'bulk_update_find[VariableLevel1]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'bulk_update_find[VariableLevel2]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'bulk_update_find[VariableLevel3]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        'bulk_update_find[DetailedVariable]':
          required:
            depends: ->
              isFindVisibleAndVisited() && areOtherFindValuesEmpty(this)
        # only the top 3 levels are required for a valid science keyword
        'bulk_update_new[Category]':
          required:
            depends: ->
              isValueVisibleAndVisited()
        'bulk_update_new[Topic]':
          required:
            depends: ->
              isValueVisibleAndVisited()
        'bulk_update_new[Term]':
          required:
            depends: ->
              isValueVisibleAndVisited()

      messages:
        'update_field':
          required: 'Update Type is required.'
        'update_type':
          required: 'Update Field is required.'
        'bulk_update_find[Category]':
          required: 'At least one keyword level must be specified.'
        'bulk_update_find[Topic]':
          required: 'At least one keyword level must be specified.'
        'bulk_update_find[Term]':
          required: 'At least one keyword level must be specified.'
        'bulk_update_find[VariableLevel1]':
          required: 'At least one keyword level must be specified.'
        'bulk_update_find[VariableLevel2]':
          required: 'At least one keyword level must be specified.'
        'bulk_update_find[VariableLevel3]':
          required: 'At least one keyword level must be specified.'
        'bulk_update_find[DetailedVariable]':
          required: 'At least one keyword level must be specified.'
        # only the top 3 levels are required for a valid science keyword
        'bulk_update_new[Category]':
          required: 'A valid science keyword must be specified.'
        'bulk_update_new[Topic]':
          required: 'A valid science keyword must be specified.'
        'bulk_update_new[Term]':
          required: 'A valid science keyword must be specified.'

      groups:
        # show only one message for each group
        find: 'bulk_update_find[Category] bulk_update_find[Topic] bulk_update_find[Term] bulk_update_find[VariableLevel1] bulk_update_find[VariableLevel2] bulk_update_find[VariableLevel3] bulk_update_find[DetailedVariable]'
        value: 'bulk_update_new[Category] bulk_update_new[Topic] bulk_update_new[Term]'

      errorPlacement: (error, element) ->
        if element.hasClass('science-keyword-find')
          $('#bulk-updates-find').append(error)
        else if element.hasClass('science-keyword-value')
          $('#bulk-updates-value').append(error)
        else
          error.insertAfter(element)

    # Handle the hiding and showing of the appropriate form
    # partial for the collection field being updated
    $('#update_field').on 'change', ->
      $('.bulk-update-partial').addClass('is-hidden')
      $('#bulk-update-field-' + $(this).val()).removeClass('is-hidden')

    # Show and hide update type specific divs
    $('#update_type').on 'change', ->
      if $(this).val() == ''
        # the prompt was selected, hide both parts of the science keyword form
        hideAndClear('bulk-updates-value')
        hideAndClear('bulk-updates-find')
        # revalidate the form to remove any validation errors from the parts we are hiding
        validator.form()

      else
        # Toggle display of the 'Record Search'
        if $(this).val() == 'FIND_AND_REMOVE' || $(this).val() == 'FIND_AND_REPLACE'
          $('#bulk-updates-find').removeClass('is-hidden')
        else
          hideAndClear('bulk-updates-find')
          # revalidate the form to remove any validation errors from the parts we are hiding
          validator.form()

        # Toggle display of the field specific form widget
        if $(this).val() == 'FIND_AND_REMOVE'
          hideAndClear('bulk-updates-value')
        else
          $('#bulk-updates-value').removeClass('is-hidden')

        # Handle the title and form description
        $selectedFieldData = $('#update_type').find('option:selected').data()

        if $selectedFieldData.hasOwnProperty('find_title')
          $('#bulk-updates-find h4.title:first').text($selectedFieldData['find_title'])
        if $selectedFieldData.hasOwnProperty('find_description')
          $('#bulk-updates-find p.form-description:first').text($selectedFieldData['find_description'])

        if $selectedFieldData.hasOwnProperty('new_title')
          $('#bulk-updates-value h4.title:first').text($selectedFieldData['new_title'])
        if $selectedFieldData.hasOwnProperty('new_description')
          $('#bulk-updates-value p.form-description:first').text($selectedFieldData['new_description'])

    # mark bulk update find container for science keywords as visited because
    # we only want to validate the fields if they have been visited
    $('.science-keyword-find').on 'blur', ->
      $('#bulk-updates-find').addClass('visited')
      $(this).valid()

    # mark the nested item picker as visited when any of the options are clicked
    # because we only want to validate the selected keyword values if it has been visited
    $('.eui-item-path, .eui-item-list-pane').on 'click', ->
      # $('.eui-nested-item-picker').addClass('visited')
      $('#bulk-updates-value').addClass('visited')

    $('.science-keyword-value').on 'change', ->
      $(this).valid()

    # mark appropriate containers as visited before submitting to ensure validation
    $('#bulk-update-preview-button').on 'click', (e) ->
      $('#bulk-updates-find, #bulk-updates-value').addClass('visited')


  # bulk updates search form
  if $('#bulk-updates-search').length > 0
    displayHelpText($('#bulk-updates-search-field'))

    $('#bulk-updates-search').validate
      errorPlacement: (error, element) ->
        error.insertAfter(element.closest('fieldset'))

      rules:
        query:
          required: true

      messages:
        query:
          required: 'Search Term is required.'

    $('#bulk-updates-search-field').on 'change', ->
      displayHelpText($(this))

  if $('#bulk-updates-search-results').length > 0
    $('#bulk-updates-search-results').tablesorter
      sortList: [[1,0]]

      # Prevent sorting on the checkboxes
      headers:
        0:
          sorter: false
        3:
          sorter: 'text'

      widgets: ['zebra']

    $('#bulk-updates-collections-select').validate
      errorPlacement: (error, element) ->
        error.insertAfter(element.closest('fieldset'))

      rules:
        'bulk_update_collections[]':
          required: true

      messages:
        'bulk_update_collections[]':
          required: 'You must select at least 1 collection.'
