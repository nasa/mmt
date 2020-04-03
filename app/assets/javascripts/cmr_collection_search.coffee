displayHelpText = (searchFieldElement) ->
  # The select element that lists the fields to search on
  $selectedFieldData = searchFieldElement.find('option:selected').data()

  # The query (value) field and its form-description
  $queryField = searchFieldElement.closest('div').find('.collection-search-field')
  $queryFieldDescription = $('#collection-query-description')

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

updateQueryForm = (searchFieldElement) ->
  format = searchFieldElement.find('option:selected').data('format')

  searchCriteriaContainer = searchFieldElement.closest('fieldset')

  $textFields = searchCriteriaContainer.find('div.text-query')
  $singleDateFields = searchCriteriaContainer.find('div.single-date-query')
  $doubleDateFields = searchCriteriaContainer.find('div.double-date-query')

  $textFields.addClass('is-hidden')
  $singleDateFields.addClass('is-hidden')
  $doubleDateFields.addClass('is-hidden')

  if format == 'single_date'
    $singleDateFields.removeClass('is-hidden')
  else if format == 'double_date'
    $doubleDateFields.removeClass('is-hidden')
  else
    $textFields.removeClass('is-hidden')

  # Disable hidden fields and clear their value
  searchCriteriaContainer.find('input').prop('disabled', false)
  searchCriteriaContainer.find('input:hidden').prop('disabled', true).val('')

$(document).ready ->
  $(document).on 'click', '.remove-search-criteria', ->
    $fieldset = $(this).closest('fieldset')

    # if the next element after the fieldset is an error div, remove it
    if $fieldset.next().is('div.validation-error')
      $fieldset.next().remove()
    $fieldset.remove()

  $(document).on 'click', '.add-search-criteria', ->
    container = $(this).closest('fieldset')
    newContainer = container.clone()

    # Create the new index for the new fields
    currentSeconds = parseInt(new Date().getTime())

    # Update the index for each field in the new row
    $.each newContainer.find('select, input'), (index, field) ->
      $(field).attr('id', $(field).attr('id').replace(/_(\d+)_/, '_' + currentSeconds.toString() + '_'))
      $(field).attr('name', $(field).attr('name').replace(/\[(\d+)\]/, '[' + currentSeconds.toString() + ']'))
      $(field).find('option:selected').removeAttr('selected')
      $(field).removeAttr('aria-describedby')

    $.each newContainer.find('label'), (index, field) ->
      $(field).attr('for', $(field).attr('for').replace(/_(\d+)_/, '_' + currentSeconds.toString() + '_'))

    # if next sibling to container is an error, insert newContainer after the error
    nextElement = container
    if container.next().is('div')
      nextElement = container.next()
    newContainer.insertAfter(nextElement)

    newContainer.find('.collection-search-field').trigger('change')
    newContainer.find('.collection-value').val('')

    return false

  $('.collection-search-field').each ->
    updateQueryForm($(this))

  # Collection search form
  if $('#collection-search').length > 0
    displayHelpText($('.collection-search-field'))

    $('#collection-search').validate
      errorPlacement: (error, element) ->
        # Don't show a second temporal error if one already exists
        if $('.validation-error').text().indexOf("At least one date is required.") == -1
          error.insertAfter(element.closest('fieldset'))

    # Temporal Extent field validation
    $.validator.addMethod('cRequiredFromGroup', $.validator.methods.require_from_group, 'At least one date is required.')
    $.validator.addClassRules('double-date-picker', {cRequiredFromGroup: [1,'.double-date-query input']})

    $(document).on 'change', '.collection-search-field', ->
      displayHelpText($(this))
      updateQueryForm($(this))

  if $('#collection-search-results').length > 0
    $('#collections-search-results').tablesorter
      sortList: [[1,0]]

      # Prevent sorting on the checkboxes
      headers:
        0:
          sorter: false
        3:
          sorter: 'text'

      widgets: ['zebra']

    $('#collections-select').validate
      # Validate hidden fields
      ignore: []

      errorPlacement: (error, element) ->
        error.insertAfter(element.closest('fieldset'))

      rules:
        'selected_collection':
          required: true
        'selected_collections[]':
          required: true

      messages:
        'selected_collection':
          required: 'You must select a collection.'
        'selected_collections[]':
          required: 'You must select at least 1 collection.'
