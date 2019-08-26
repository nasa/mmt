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
      errorPlacement: (error, element) ->
        if element.attr('name') == 'catalog_item_guid_toList[]'
          element.closest('fieldset').append(error)
        else
          error.insertAfter(element)

      rules:
        definition_guid:
          required: true
        'catalog_item_guid_toList[]':
          required: ->
            $('.___toList option').length == 0

      messages:
        definition_guid:
          required: 'Data Quality Summary is required.'
        'catalog_item_guid_toList[]':
          required: 'You must select at least 1 collection.'

  if $("#data-quality-summary-form").length > 0
    $('#data-quality-summary-form').validate
      errorPlacement: (error, element) ->
        if element.hasClass('redactor')
          error.insertAfter(element.closest('.redactor-box'))
        else
          error.insertAfter(element)

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
      errorPlacement: (error, element) ->
        element.closest('fieldset').append(error)

      rules:
        'data_quality_summary_assignment[]':
          required: true

      messages:
        'data_quality_summary_assignment[]':
          required: 'You must select at least 1 assignment.'

    $('.toggle-unassigned-collections').change (event) ->
      if $(this).prop('checked') == true
        $('tr.unassigned-collection').show()
      else
        $('tr.unassigned-collection').hide()

      if $('tr.unassigned-collection').length > 0
        $('.no-assignments-message').show()
      else
        $('.no-assignments-message').hide()

    # trigger the change event on the checkbox when the page loads in case the checkbox
    # is already checked (this can happen when the user hits the back button)
    $('.toggle-unassigned-collections').trigger 'change'

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
      'format'
      'bold'
      'italic'
      'lists'
      'horizontalrule'
      'indent'
      'outdent'
    ]
    blurCallback: (e) ->
      this.core.getTextarea().valid()
