# Handle the enabling and disabling of the granule
# access constraints and temporal filter form fields
handleGranuleConstraintState = (granulesEnabled) ->
  $('#granule-access-constraints-container :input').prop('disabled', !granulesEnabled)
  $('#granule-temporal-filter-container :input').prop('disabled', !granulesEnabled)
  $('#granule-access-constraints-container').toggleClass('disabled', !granulesEnabled)
  $('#granule-temporal-filter-container').toggleClass('disabled', !granulesEnabled)

# Handle the hiding and showing of the collection chooser
handleCollectionOptions = (selectedCollections) ->
  $('#chooser-widget :input').prop('disabled', !selectedCollections)

  if selectedCollections
    $('#chooser-widget').fadeIn(100)
  else
    $('#chooser-widget').fadeOut(100)

$(document).ready ->
  $('#permission-collection-list').tablesorter
    sortList: [[0,0]]

    widgets: ['zebra', 'filter']
    headers:
      2:
        sorter: 'text'
      3:
        sorter: 'text'

  # 'Toggle Collection Highlighting' button functionality for the
  # collection list displayed on the permission show page
  $('.highlight-collections').on 'click', ->
    constraintMinimum = parseFloat($(this).data('min-value'))
    constraintMaximum = parseFloat($(this).data('max-value'))
    includeUndefinedValue = $(this).data('include-undefined-value')

    $.each $('#permission-collection-list').find('td.access-constraint'), (index, element) ->
      constraintValue = parseFloat($(element).html())

      # If the minimum and maximum are the same or are between the min and max values
      if (constraintValue >= constraintMinimum && constraintValue <= constraintMaximum) ||

          # If including undefined values and value is undefined
          (includeUndefinedValue && isNaN(constraintValue))

        $(this).closest('tr').toggleClass('selected')
      else
        # Otherwise fade the row out
        $(this).closest('tr').toggleClass('disabled')

  if $(".permission-form").length > 0
    handleGranuleConstraintState($('input[name=granule_applicable]').is(':checked'))
    handleCollectionOptions($('input[name=collection_option]:checked').val() == 'selected')

    # widget for choosing collections
    collectionsChooser = null

    if collectionsChooser == null
      collectionsChooser = new Chooser({
        id: 'collectionsChooser',
        url: '/provider_collections',
        nextPageParm: 'page_num',
        filterParm: 'short_name',
        target: $('#chooser-widget'),
        fromLabel: 'Available Collections',
        toLabel: 'Selected Collections',
        uniqueMsg: 'Collection already added',
        attachTo: $('#collection_selections'),
        addButton: {
          cssClass: 'eui-btn nowrap',
          arrowCssClass: 'fa fa-plus',
          text: ''
        },
        delButton: {
          cssClass: 'eui-btn nowrap',
          arrowCssClass: 'fa fa-minus',
          text: ''
        },
        delAllButton: {
          cssClass: 'eui-btn nowrap',
          arrowCssClass: 'fa fa-trash',
          text: ''
        },
        allowRemoveAll: true,
        showS3Buckets: true,
        errorCallback: ->
          $('<div class="eui-banner--danger">' +
              'A server error occurred. Unable to get collections.' +
              '</div>').prependTo '#main-content'
      })

      collectionsChooser.init()

    # Form an array of the values that were previously selected
    selectedValues = ($(element).val() for element in $('.permission-form .selected-collection'))

    # Ping the same endpoint we use for populating the Chooser widget
    # to retrieve data specific to the selected values
    if selectedValues.length > 0
      # Not providing any concept ids will result in all items coming back, avoid that
      $.ajax '/provider_collections',
        method: 'POST'
        data:
          concept_id: selectedValues
          page_size: selectedValues.length
        success: (data) ->
          # Sets the selected values of the chooser
          collectionsChooser.setToVal(data.items)
        fail: (data) ->
          console.log data

    # On form submit, select all of the options in the 'Selected Collections' multiselect
    # so that it can be properly interpreted by the controller
    $('.permission-form').on 'submit', ->
      $('#collectionsChooser_toList option').prop('selected', true)

    $('input[name=granule_applicable]').on 'change', ->
      handleGranuleConstraintState($(this).is(':checked'))

    $('input[name=collection_option]').on 'change', ->
      handleCollectionOptions($(this).val() == 'selected')

    # 'Clear Collection/Granule Filters'
    $('.clear-filters').on 'click', (event) ->
      $containerId = $(this).data('container')
      # clear values (not radio buttons)
      $("##{$containerId} :input").not("input[type='radio']").val('')
      # clear checkboxes or radio buttons
      $("##{$containerId} input:checkbox").prop('checked', false)
      $("##{$containerId} input:radio").prop('checked', false)

      # remove validation errors and required icons
      $("##{$containerId} label").removeClass 'eui-required-o'
      $("##{$containerId} .eui-banner--danger.validation-error").remove()

      event.preventDefault()

    # add or remove required icons for grouped fields that are conditionally
    # required - they are not required for the form to be valid, but if one of
    # them is populated, they are all required together
    # access constraint min and max values, temporal filters all fields
    $('.grouped-field').on  'blur', ->
      $currentField = $(this)
      $groupedFieldsParent = $currentField.closest('.grouped-fields-parent')
      $groupedFieldLabels = $groupedFieldsParent.find('.grouped-field-label')
      $groupedFields = $groupedFieldsParent.find('.grouped-field')

      $fieldsWithValues = $groupedFields.filter ->
        if $(this).prop('type') == 'radio'
          $(this).prop('checked')
        else
          $(this).val() != ''

      if $fieldsWithValues.length > 0
        # at least one field in the group has a value
        $groupedFieldLabels.addClass 'eui-required-o'
      else
        # no values in the group
        $groupedFieldLabels.removeClass 'eui-required-o'

    # for some reason jQuery seems to be misbehaving with the mask radio buttons
    # with `prop('checked')` BUT NOT for required icons that uses `filter()`.
    # therefore, it may be more consistent if we have a method to check the
    # radio buttons with filter()
    areMaskFieldsChecked = ($maskRadioButtons) ->
      checkedField = $maskRadioButtons.filter ->
        $(this).prop('checked')

      if checkedField.length > 0 then true else false

    # Validate new permissions form with jquery validation plugin
    $('.permission-form').validate
      errorPlacement: (error, element) ->
        if element.prop('id') == 'search_groups_' || element.prop('id') == 'search_and_order_groups_'
          # error placement is trickier with the groups because of select2 and
          # the table so we place it after the table
          error.addClass('full-width')
          $table = element.closest('table')
          error.insertAfter($table)
        else if element.hasClass('min-max-value')
          error.addClass('full-width')
          error.insertAfter(element.closest('.grid-row'))
        else if element.hasClass('grouped-field')
          error.addClass('full-width')
          error.insertAfter(element.closest('.grouped-fields-parent'))
        else if element.is(':checkbox')
          error.insertAfter(element.closest('.checkbox-group'))
        else
          error.insertAfter(element)

      rules:
        permission_name:
          required: true
        collection_applicable:
          required: ->
            !$('input[name=granule_applicable]').is(':checked')
        granule_applicable:
          required: ->
            !$('input[name=collection_applicable]').is(':checked')
        'collectionsChooser_toList[]':
          required: ->
            $('input[name=collection_option]:checked').val() == 'selected' && $('#collectionsChooser_toList').find('option').length == 0 && $('.hidden-collection').length == 0
        'collection_access_value[min_value]':
          required: (element) ->
            # if min or max has a value, the other one is required
            $('#collection_access_value_max_value').val() != ''
          number: true
        'collection_access_value[max_value]':
          required: (element) ->
            # if min or max has a value, the other one is required
            $('#collection_access_value_min_value').val() != ''
          number: true
          greaterThanOrEqual: $('#collection_access_value_min_value')
        'granule_access_value[min_value]':
          required: (element) ->
            # if min or max has a value, the other one is required
            $('#granule_access_value_max_value').val() != ''
          number: true
        'granule_access_value[max_value]':
          required: (element) ->
            # if min or max has a value, the other one is required
            $('#granule_access_value_min_value').val() != ''
          number: true
          greaterThanOrEqual: $('#granule_access_value_min_value')
        'collection_temporal_filter[start_date]':
          # if any temporal field has a value, the others are required also
          startBeforeStop: $('#collection_temporal_filter_stop_date')
          required: (element) ->
            $('#collection_temporal_filter_stop_date').val() != '' || areMaskFieldsChecked($('input[name="collection_temporal_filter[mask]"]'))
        'collection_temporal_filter[stop_date]':
          # if any temporal field has a value, the others are required also
          required: (element) ->
            $('#collection_temporal_filter_start_date').val() != '' || areMaskFieldsChecked($('input[name="collection_temporal_filter[mask]"]'))
        'collection_temporal_filter[mask]':
          # if any temporal field has a value, the others are required also
          required: (element) ->
            $('#collection_temporal_filter_start_date').val() != '' || $('#collection_temporal_filter_stop_date').val() != ''
        'granule_temporal_filter[start_date]':
          # if any temporal field has a value, the others are required also
          startBeforeStop: $('#granule_temporal_filter_stop_date')
          required: (element) ->
            $('#granule_temporal_filter_stop_date').val() != '' || areMaskFieldsChecked($('input[name="granule_temporal_filter[mask]"]'))
        'granule_temporal_filter[stop_date]':
          # if any temporal field has a value, the others are required also
          required: (element) ->
            $('#granule_temporal_filter_start_date').val() != '' || areMaskFieldsChecked($('input[name="granule_temporal_filter[mask]"]'))
        'granule_temporal_filter[mask]':
          # if any temporal field has a value, the others are required also
          required: (element) ->
            $('#granule_temporal_filter_start_date').val() != '' || $('#granule_temporal_filter_stop_date').val() != ''
        'search_groups[]':
          required: (element) ->
            # field is required if the other field has no value/selection
            $('#search_and_order_groups_').val() == null || $('#search_and_order_groups_').val().length == 0
        'search_and_order_groups[]':
          required: (element) ->
            # field is required if the other field has no value/selection
            $('#search_and_order_groups_').val() == null || $('#search_groups_').val().length == 0

      messages:
        permission_name:
          required: 'Permission Name is required.'
        collection_applicable:
          required: 'Permission must apply to Collections and/or Granules.'
        granule_applicable:
          required: 'Permission must apply to Collections and/or Granules.'
        'collectionsChooser_toList[]':
          required: 'You must select at least 1 collection.'
        'collection_access_value[min_value]':
          required: 'Minimum and Maximum values must be specified together.'
        'collection_access_value[max_value]':
          required: 'Minimum and Maximum values must be specified together.'
          greaterThanOrEqual: 'Maximum value must be greater than or equal to Minimum value.'
        'granule_access_value[min_value]':
          required: 'Minimum and Maximum values must be specified together.'
        'granule_access_value[max_value]':
          required: 'Minimum and Maximum values must be specified together.'
          greaterThanOrEqual: 'Maximum value must be greater than or equal to Minimum value.'
        'collection_temporal_filter[start_date]':
          required: 'Start Date, Stop Date, and Mask must be specified together.'
          startBeforeStop: 'Start Date must be earlier than Stop Date.'
        'collection_temporal_filter[stop_date]':
          required: 'Start Date, Stop Date, and Mask must be specified together.'
        'collection_temporal_filter[mask]':
          required: 'Start Date, Stop Date, and Mask must be specified together.'
        'granule_temporal_filter[start_date]':
          required: 'Start Date, Stop Date, and Mask must be specified together.'
          startBeforeStop: 'Start Date must be earlier than Stop Date.'
        'granule_temporal_filter[stop_date]':
          required: 'Start Date, Stop Date, and Mask must be specified together.'
        'granule_temporal_filter[mask]':
          required: 'Start Date, Stop Date, and Mask must be specified together.'
        'search_groups[]':
          required: 'Please specify at least one Search group or one Search & Order group.'
        'search_and_order_groups[]':
          required: 'Please specify at least one Search group or one Search & Order group.'

      groups:
        # this should make it so only one message is shown for each group of elements
        permission_group: 'search_groups[] search_and_order_groups[]'
        collection_access_value_group: 'collection_access_value[min_value] collection_access_value[max_value]'
        collection_temporal_filter_group: 'collection_temporal_filter[start_date] collection_temporal_filter[stop_date] collection_temporal_filter[mask]'
        graunle_access_value_group: 'granule_access_value[min_value] granule_access_value[max_value]'
        granule_temporal_filter_group: 'granule_temporal_filter[start_date] granule_temporal_filter[stop_date] granule_temporal_filter[mask]'
        applies_to: 'collection_applicable granule_applicable'

    $.validator.addMethod 'greaterThanOrEqual', (value, elem, arg) ->
      # the built in max and min methods didn't seem to work with the depends
      # condition or possibly with comparing values dynamically, so here we
      # are defining our own method to ensure the Max is greater than or equal to the Min
      $minInput = arg
      minimum = arg.val()

      return true if value == '' || minimum == ''
      parseFloat(value) >= parseFloat(minimum)

    $.validator.addMethod 'startBeforeStop', (value, elem, arg) ->
      # ensure that the start_date is before stop_date
      $stop_date = arg

      return true if value == '' || $stop_date.val() == ''
      Date.parse(value) < Date.parse($stop_date.val())

    visitedPermissionGroupSelect = []

    validateSelect2s = (selectDropdown) ->
      if visitedPermissionGroupSelect.indexOf('search_groups') != -1 && visitedPermissionGroupSelect.indexOf('search_and_order_groups') != -1
        $(selectDropdown).valid()

    toggleSelectOption = (selectId, optionValue, action) ->
      $targetOption = $(selectId).find('option[value="' + optionValue + '"]')
      disabledValue = action == 'disable' ? true : false
      $targetOption.prop('disabled', disabledValue)

      # need to call this again, or the disabled/enabled state doesn't display properly when this is triggered multiple times
      $(selectId).select2()

    $('#search_groups_').select2()
    .on 'select2:open', (e) ->
      visitedPermissionGroupSelect.push 'search_groups' unless visitedPermissionGroupSelect.indexOf('search_groups') != -1
    .on 'select2:close', (e) ->
      # check if the visited array has both select2 fields, and if so validate on close
      validateSelect2s(this)
    .on 'change', (e) ->
      # check if the visited array has both select2 fields, and if so validate on close
      validateSelect2s(this)
    .on 'select2:select', (e) ->
      # when a group is selected, disable the option in the other dropdown
      selectedValue = e.params.data.id
      toggleSelectOption('#search_and_order_groups_', selectedValue, 'disable')
    .on 'select2:unselect', (e) ->
      # when a group is unselected, enable the option in the other dropdown
      unselectedValue = e.params.data.id
      toggleSelectOption('#search_and_order_groups_', unselectedValue, 'enable')


    $('#search_and_order_groups_').select2()
    .on 'select2:open', (e) ->
      visitedPermissionGroupSelect.push 'search_and_order_groups' unless visitedPermissionGroupSelect.indexOf('search_and_order_groups') != -1
    .on 'select2:close', (e) ->
      # check if the visited array has both select2 fields, and if so validate on close
      validateSelect2s(this)
    .on 'change', (e) ->
      # check if the visited array has both select2 fields, and if so validate on close
      validateSelect2s(this)
    .on 'select2:select', (e) ->
      # when a group is selected, disable the option in the other dropdown
      selectedValue = e.params.data.id
      toggleSelectOption('#search_groups_', selectedValue, 'disable')
    .on 'select2:unselect', (e) ->
      # when a group is unselected, enable the option in the other dropdown
      unselectedValue = e.params.data.id
      toggleSelectOption('#search_groups_', unselectedValue, 'enable')


    # on load, run through the select2 dropdowns to test for already selected values and disable the options in the other dropdown
    $selectedSearchGroupOptions = $('#search_groups_').find('option:selected')
    $selectedSearchOrderGroupOptions = $('#search_and_order_groups_').find('option:selected')

    $selectedSearchGroupOptions.each (index, option) ->
      toggleSelectOption('#search_and_order_groups_', $(option).val(), 'disable')
    $selectedSearchOrderGroupOptions.each (index, option) ->
      toggleSelectOption('#search_groups_', $(option).val(), 'disable')
