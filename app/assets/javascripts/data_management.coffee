$(document).ready ->
  if $("#data-quality-summary-assignments-form").length > 0
    # widget for choosing collections
    collectionsChooser = null

    if collectionsChooser == null
      collectionsChooser = new Chooser({
        id: 'catalog_item_guid',
        url: '/provider_collections',
        nextPageParm: 'page_num',
        filterParm: 'short_name',
        uniqueIdentifierParam: 'concept_id',
        target: $('#data-quality-summary-assignment-chooser-widget'),
        fromLabel: 'Available Collections',
        toLabel: 'Selected Collections',
        uniqueMsg: 'Collection is already selected.',
        attachTo: $('#data-quality-summary-assignment-collection-selections'),
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

    # On form submit, select all of the options in the 'Selected Collections' multiselect
    # so that it can be properly interpreted by the controller
    $('#data-quality-summary-assignments-form').on 'submit', ->
      $('#catalog_item_guid_toList option').prop('selected', true)

    $('#data-quality-summary-assignments-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
        if element.attr('name') == 'catalog_item_guid_toList[]'
          element.closest('fieldset').append(error)
        else
          error.insertAfter(element)

      onfocusout: (error) ->
        this.element(error)

      highlight: (element, errorClass) ->
        # Prevent highlighting the fields themselves
        return false

      rules:
        definition_guid:
          required: true
        'catalog_item_guid_toList[]':
          required: true

      messages:
        definition_guid:
          required: 'Data Quality Summary is required.'
        'catalog_item_guid_toList[]':
          required: 'You must select at least 1 collection.'

  if $("#data-quality-summary-form").length > 0
    $('#data-quality-summary-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
        if element.hasClass('redactor')
          error.insertAfter(element.closest('.redactor-box'))
        else
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

      # This allows even hidden fields to be validated, in this case the redactor
      # WYSIWYG plugin below hides the text area and is therefore ignored by validate
      ignore: []

      rules:
        name:
          required: true
        summary:
          required: true

      messages:
        name:
          required: 'Name is required.'
        summary:
          required: 'Summary is required.'

  if $("#delete-data-quality-summary-assignments-form").length > 0
    $('#delete-data-quality-summary-assignments-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
        element.closest('fieldset').append(error)

      onfocusout: (error) ->
        this.element(error)

      highlight: (element, errorClass) ->
        # Prevent highlighting the fields themselves
        return false

      rules:
        'data_quality_summary_assignment[]':
          required: true

      messages:
        'data_quality_summary_assignment[]':
          required: 'You must select at least 1 assignment.'

    $('.toggle-unassigned-collections').change (event) ->
      $('tr.unassigned-collection').toggle()

      if $('tr.unassigned-collection').length > 0
        $('.no-assignments-message').toggle()

  # jQuery Validate has a 'feature' that means this only gets called on blur, we want on change
  $('.data-quality-summary-form select').on 'change', ->
    $(this).valid()

  $('#assignment-collections').tablesorter
    # Prevent sorting on the checkboxes
    headers:
      0:
        sorter: false
      3:
        sorter: 'text'

  $('.redactor').redactor
    formatting: ['p', 'h1', 'h2', 'h3', 'h4', 'h5']
    buttons: [
      'formatting'
      'bold'
      'italic'
      'orderedlist'
      'unorderedlist'
      'horizontalrule'
      'indent'
      'outdent'
      'alignment'
    ]
    blurCallback: (e) ->
      this.core.getTextarea().valid()
