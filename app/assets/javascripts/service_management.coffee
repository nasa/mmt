$(document).ready ->
  manageEntryTypeFields = (entryType) ->
    if entryType == 'SERVICE_IMPLEMENTATION'
      $('#service-implementation-container').show 0, ->
        # Ensure the field is enabled so it's not ignored
        $('#service_entry_service_interface_guid').attr("disabled", false)
    else
      $('#service-implementation-container').hide 0, -> 
        # Disable the field to prevent it from appearing in the params hash
        $('#service_entry_service_interface_guid').attr("disabled", true)


  if $("#service-option-form").length > 0
    $('#service-option-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
        error.insertAfter(element)

      # This library handles focus oddly, this ensures that we scroll
      # to and focus on the first element with an error in the form
      onfocusout: false
      invalidHandler: (form, validator) ->
        if validator.numberOfInvalids() > 0
          validator.errorList[0].element.focus()

      highlight: (element, errorClass) ->
        # Prevent highlighting the fields themselves
        return false

      rules:
        'service_option[name]':
          required: true
        'service_option[description]':
          required: true
        'service_option[form]':
          required: true

      messages:
        'service_option[name]':
          required: 'Name is required.'
        'service_option[description]':
          required: 'Description is required.'
        'service_option[form]':
          required: 'Form XML is required.'

  if $("#service-entry-form").length > 0
    # Make sure to display the correct form fields
    manageEntryTypeFields($('#service_entry_entry_type').val())

    # widget for choosing collections
    collectionsChooser = null

    if collectionsChooser == null
      collectionsChooser = new Chooser({
        id: 'tag_guids',
        url: '/provider_collections',
        nextPageParm: 'page_num',
        filterParm: 'short_name',
        target: $('#service-entry-chooser-widget'),
        fromLabel: 'Available Collections',
        toLabel: 'Selected Collections',
        uniqueMsg: 'Collection is already selected.',
        attachTo: $('#service-entry-collection-selections'),
        toMax: 100,
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

    # Form an array of the values that were previously selected
    selectedValues = ($(element).val() for element in $('#service-entry-form .selected-collection'))

    # Ping the same endpoint we use for populating the Chooser widget
    # to retrieve data specific to the selected values
    if selectedValues.length > 0
      # Not providing any concept ids will result in all items coming back, avoid that
      $.ajax '/provider_collections?' + $.param('concept_id': selectedValues),
        success: (data) ->
          # Sets the selected values of the chooser
          collectionsChooser.setToVal(data.items)
        fail: (data) ->
          console.log data

    # On form submit, select all of the options in the 'Selected Collections' multiselect
    # so that it can be properly interpreted by the controller
    $('#service-entry-form').on 'submit', ->
      $('#tag_guids_toList option').prop('selected', true)

    $('#service-entry-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
        error.insertAfter(element)

      # This library handles focus oddly, this ensures that we scroll
      # to and focus on the first element with an error in the form
      onfocusout: false
      invalidHandler: (form, validator) ->
        if validator.numberOfInvalids() > 0
          validator.errorList[0].element.focus()

      highlight: (element, errorClass) ->
        # Prevent highlighting the fields themselves
        return false

      rules:
        'service_entry[name]':
          required: true
          maxlength: 255
        'service_entry[url]':
          required: true
          maxlength: 4000
        'service_entry[description]':
          required: true
          maxlength: 4000
        'service_entry[entry_type]':
          required: true
        'service_entry[service_interface_guid]':
          required: true

      messages:
        'service_entry[name]':
          required: 'Name is required.'
        'service_entry[url]':
          required: 'URL is required.'
        'service_entry[description]':
          required: 'Description is required.'
        'service_entry[entry_type]':
          required: 'Type is required.'
        'service_entry[service_interface_guid]':
          required: 'Service Interface is required when creating a Service Implementation.'

  if $("#service-option-assignments-form").length > 0
    # widget for choosing collections
    serviceEntryChooser = null

    if serviceEntryChooser == null
      serviceEntryChooser = new Chooser({
        id: 'service_entries',
        url: '/service_implementations_with_datasets',
        nextPageParm: 'page_num',
        filterParm: 'name',
        target: $('#service-option-assignment-chooser-widget'),
        fromLabel: 'Available Service Entries',
        toLabel: 'Selected Service Entries',
        uniqueMsg: 'Service Entry is already selected.',
        attachTo: $('#service-entry-selections'),
        toMax: 100,
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
            'A server error occurred. Unable to get service entries.' +
            '</div>').prependTo '#main-content'
      })

      serviceEntryChooser.init()

    # On form submit, select all of the options in the 'Selected Service Entries' multiselect
    # so that it can be properly interpreted by the controller
    $('#service-option-assignments-form').on 'submit', ->
      $('#service_entries_toList option').prop('selected', true)

    $('#service-option-assignments-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
        error.insertAfter(element)

      # This library handles focus oddly, this ensures that we scroll
      # to and focus on the first element with an error in the form
      onfocusout: false
      invalidHandler: (form, validator) ->
        if validator.numberOfInvalids() > 0
          validator.errorList[0].element.focus()

      highlight: (element, errorClass) ->
        # Prevent highlighting the fields themselves
        return false

      rules:
        'service_entries_toList[]':
          required: true

      messages:
        'service_entries_toList[]':
          required: 'You must select at least 1 service entry.'
