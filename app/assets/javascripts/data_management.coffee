$(document).ready ->
  $('.redactor').redactor
    buttons: [
      'formatting'
      'bold'
      'italic'
      'underline'
      'orderedlist'
      'unorderedlist'
      'horizontalrule'
      'indent'
      'outdent'
      'alignment'
    ]
    blurCallback: (e) ->
      this.core.getTextarea().valid()

  $('#data-quality-summary-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false
    
    errorPlacement: (error, element) ->
      if element.hasClass('redactor')
        error.insertAfter(element.closest('.redactor-box'))
      else
        error.insertAfter(element)

    onfocusout: (error) ->
      this.element(error)

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

  $('#data-quality-summary-assignments-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false
    
    errorPlacement: (error, element) ->
      if element.attr('name') == 'catalog_item_guid[]'
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
      'catalog_item_guid[]': 
        required: true

    messages:
      definition_guid:
        required: 'Data Quality Summary is required.'
      'catalog_item_guid[]':
        required: 'You must select at least 1 collection.'

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

  # jQuery Validate has a 'feature' that means this only gets called on blur, we want on change
  $('select').on 'change', ->
    $(this).valid()