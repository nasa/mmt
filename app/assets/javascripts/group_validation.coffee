$(document).ready ->
  # Validate group form
  if $('.group-form').length > 0
    $('.group-form').validate
      errorClass: 'eui-banner--danger'
      errorElement: 'div'
      onkeyup: false

      errorPlacement: (error, element) ->
        if element.attr('type') == 'checkbox'
          element.closest('div').append(error)
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

      # TODO: what happens on 'edit' when mgmt group is disabled?
      rules:
        'group[name]':
          required: true
        'group[description]':
          required: true
        'group[initial_management_group]':
          required: true
      messages:
        'group[name]':
          required: 'Name is required.'
        'group[description]':
          required: 'Description is required.'
        'group[initial_management_group]':
          required: 'Initial Management Group is required.'
