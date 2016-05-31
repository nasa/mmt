$(document).ready ->
  $('#summary').redactor
    buttons: [
      'html'
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
    # blurCallback: (e) ->
    #   $(e.toElement).validate
    #   $.validator.addMethod 'validateRedactor', (value, element) -> 
    #     return $('.redactor-editor').length == 0

  $('#data-quality-summary-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false
    
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