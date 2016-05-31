# $.validator.setDefaults({ ignore: [] });
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