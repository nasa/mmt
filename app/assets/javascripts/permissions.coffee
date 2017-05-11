$(document).ready ->
  if $(".permission-form").length > 0

    $('.display-modal').leanModal
      top: 200
      overlay: 0.6
      closeButton: '.modal-close'

    # widget for choosing collections
    collectionsChooser = null

    start_widget = ->
      if collectionsChooser == null
        collectionsChooser = new Chooser({
          id: 'collectionsChooser',
          url: '/permission/all_collections',
          nextPageParm: 'page_num',
          filterParm: 'short_name',
          target: $('#chooser-widget'),
          fromLabel: 'Available collections',
          toLabel: 'Selected collections',
          uniqueMsg: 'Collection already added',
          attachTo: $('#collection_selections'),
          delimiter: "%%__%%",
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
          errorCallback: ->
            $('<div class="eui-banner--danger">' +
                'A server error occurred. Unable to get collections.' +
                '</div>').prependTo '#main-content'
        })

        collectionsChooser.init()

        $('#collectionsChooser_toList').rules 'add',
            required:
              depends: ->
                if $('#collection_options').val() == 'selected-ids-collections' && $('#hidden_collections').length == 0
                  return true
                return false
            messages:
              required: 'You must select at least 1 collection.'


    # show the Chooser widget if a refresh of the page has "selected collections" as the dropdown value
    setTimeout ( ->
      if $('#collection_options').val() == 'selected-ids-collections'
        $('#chooser-widget').removeClass 'is-hidden'
        start_widget()

        if $('#collection_selections').val()? && $('#collection_selections').val().length > 0
          opts = []
          entry_titles = $('#collection_selections').val().split("%%__%%")
          $.each entry_titles, (index, value)->
            opt_val = value.split('|')[1].trim()
            opts.push( [opt_val, value] )
          collectionsChooser.setToVal(opts)
    ), 500

    # Show respective field based on selection
    $('#collection_options').on 'change', ->
      collectionOptions = $(this).val()

      if collectionOptions == 'selected-ids-collections'
        $('#chooser-widget').removeClass 'is-hidden'
        start_widget()
        $('#collection_constraint_values').removeClass 'is-hidden'
      else if collectionOptions == 'all-collections'
        $('#chooser-widget').addClass 'is-hidden'
        $('#collection_constraint_values').removeClass 'is-hidden'
      else
        $('#chooser-widget').addClass 'is-hidden'
        $('#collection_constraint_values').addClass 'is-hidden'

    $('#granule_options').on 'change', ->
      if $(this).val() == 'all-granules'
        $('#granule_constraint_values').removeClass 'is-hidden'
      else
        $('#granule_constraint_values').addClass 'is-hidden'


    # add or remove required icons for access value min and max fields if at least one has an input value
    $('.min-max-value').on 'blur', ->
      $currentAccessVal = $(this)
      $currentCol = $currentAccessVal.closest('.min-max-col')
      $otherAccessVal = $currentCol.siblings('.min-max-col').find('.min-max-value')

      $currentLabel = $("label[for='" + $currentAccessVal.attr('id') + "']")
      $otherLabel = $("label[for='" + $otherAccessVal.attr('id') + "']")

      if $currentAccessVal.val() == '' && $otherAccessVal.val() == ''
        # both inputs are empty so are not required
        $currentLabel.removeClass 'eui-required-o'
        $otherLabel.removeClass 'eui-required-o'
      else
        # at least one input is not empty, so both should be required
        $currentLabel.addClass 'eui-required-o'
        $otherLabel.addClass 'eui-required-o'


    # Validate new permissions form with jquery validation plugin
    $('.permission-form').validate
      errorPlacement: (error, element) ->
        if element.attr('id') == 'search_groups_' || element.attr('id') == 'search_and_order_groups_'
          # error placement is trickier with the groups because of select2 and the table
          # placing it after the table
          error.addClass('full-width')
          $table = element.closest('table')
          error.insertAfter($table)
        else if element.hasClass('min-max-value')
          $row = element.closest('.min-max-row')
          error.addClass('full-width')
          error.insertAfter($row)
        else
          error.insertAfter(element)

      rules:
        permission_name:
          required: true
        collection_options:
          required: true
        'collection_access_value[min_value]':
          required: (element) ->
            # field should be required if min has a value
            $('#collection_access_value_max_value').val() != ''
          number: true
        'collection_access_value[max_value]':
          required: (element) ->
            # field should be required if max has a value
            $('#collection_access_value_min_value').val() != ''
          number: true
          greaterThan: $('#collection_access_value_min_value')
        granule_options:
          required: true
        'granule_access_value[min_value]':
          required: (element) ->
            # field should be required if max has a value
            $('#granule_access_value_max_value').val() != ''
          number: true
        'granule_access_value[max_value]':
          required: (element) ->
            # field should be required if min has a value
            $('#granule_access_value_min_value').val() != ''
          number: true
          greaterThan: $('#granule_access_value_min_value')
        'search_groups[]':
          required: (element) ->
            # field is required if the other field has no value/selection
            $('#search_and_order_groups_').val() == null
        'search_and_order_groups[]':
          required: (element) ->
            # field is required if the other field has no value/selection
            $('#search_groups_').val() == null

      messages:
        permission_name:
          required: 'Permission Name is required.'
        collection_options:
          required: 'Collections must be specified.'
        'collection_access_value[min_value]':
          required: 'Minimum and Maximum values must be specified together.'
        'collection_access_value[max_value]':
          required: 'Minimum and Maximum values must be specified together.'
          greaterThan: 'Maximum value must be greater than Minimum value.'
        granule_options:
          required: 'Granules must be specified.'
        'granule_access_value[min_value]':
          required: 'Minimum and Maximum values must be specified together.'
        'granule_access_value[max_value]':
          required: 'Minimum and Maximum values must be specified together.'
          greaterThan: 'Maximum value must be greater than Minimum value.'
        'search_groups[]':
          required: 'Please specify at least one Search group or one Search & Order group.'
        'search_and_order_groups[]':
          required: 'Please specify at least one Search group or one Search & Order group.'

      groups:
        # this should make it so only one message is shown for each group of elements
        permission_group: 'search_groups[] search_and_order_groups[]'
        collection_access_value_group: 'collection_access_value[min_value] collection_access_value[max_value]'
        graunle_access_value_group: 'granule_access_value[min_value] granule_access_value[max_value]'

    $.validator.addMethod 'greaterThan', (value, elem, arg) ->
      # the built in max and min methods didn't seem to work with the depends
      # condition or possibly with comparing values dynamically, so here we
      # are defining our own method to ensure the Max is greater than the Min
      $minInput = arg
      minimum = arg.val()

      return true if value == '' || minimum == ''
      parseFloat(value) > parseFloat(minimum)
    , 'Maximum value must be greater than Minimum value.' # default message

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


    $('#permissions-save-button').click( ->
      $('#collectionsChooser_toList').find('option:first').prop('selected', true)
      $('#collectionsChooser_toList').find('option:first').click()
    )
