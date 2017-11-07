$(document).ready ->
  if $('#delete-variable-collection-associations-form').length > 0
    $('#delete-variable-collection-associations-form').validate
      errorPlacement: (error, element) ->
        error.insertAfter(element.closest('table'))

      rules:
        'selected_collections[]':
          required: true

      messages:
        'selected_collections[]':
          required: 'You must select at least 1 collection.'
