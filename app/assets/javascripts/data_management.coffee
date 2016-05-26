$(document).ready ->
  $('#data-quality-summary-form').validate
    errorClass: 'eui-banner--danger'
    errorElement: 'div'
    onkeyup: false

    onfocusout: (error) ->
      this.element(error)

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