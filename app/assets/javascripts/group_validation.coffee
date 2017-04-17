$(document).ready ->
  # Validate group form
  if $('.group-form').length > 0
    $('.group-form').validate
      rules:
        'group[name]':
          required: true
        'group[description]':
          required: true
      messages:
        'group[name]':
          required: 'Name is required.'
        'group[description]':
          required: 'Description is required.'
