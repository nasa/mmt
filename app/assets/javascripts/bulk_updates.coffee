$(document).ready ->
  $('#bulk-updates-search').validate

    errorPlacement: (error, element) ->
      error.insertAfter(element.closest('fieldset'))

    rules:
      query:
        required: true

    messages:
      query:
        required: 'Search Query is required.'
