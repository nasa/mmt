handleFormNavigation = (element) ->
  # When we hijack a click like this we lose the button that we pressed,
  # so we've added a hidden field to the form and will record it there
  $('#commit').val(element.val())

  # Check the form validity
  formIsValid = element.closest('form').validate().checkForm()

  # If the form is invald, display the dialog
  if !formIsValid
    $('#display-invalid-draft-modal').click()

    false
  else
    true

$(document).ready ->
  # Keep track of the value of the jump-to in case we need to revert back to it
  currentJumpToValue = $('.jump-to-section').val()

  # jQuery Validation
  $('#umm_form').validate
    ignore: []
    onsubmit: false

    # Due to the requirement of showing the errors at the top of the page
    # and the existence of https://github.com/jquery-validation/jquery-validation/issues/1864
    # we have to implement `success`, `errorPlacement`, and `showError` in the following way.
    #
    # * errorPlacement only gets call when the error is first recognized. In this method
    #   we display the div that will contain the list of errors, and execute the default
    #
    # * Every time an error is raised, `showErrors` is called however due to the but above
    #    only the current error is returned which prevents our ability to re-render errors
    #    each time within showErrors
    #
    # == Our workaround
    #
    # 1. When an error is raised `errorPlacement` is called that places the divs for the provided
    #    error, in our case this initial error also renders the list container at the top.
    # 2. showErrors is called each time an error is raised (every onBlur) but only provides the
    #    single field that the user just left. When this happens we just update the li by id
    # 3. When a field is 'fixed' we have to manually remove the item from the list but to do that
    #    we have to override the `success` method which generally removes the error div under the
    #    field as well, so we have to do that as well.
    success: (label, element) ->
      # Remove the error from the list at the top of the form
      $('#umm-form-errors ul li#' + element.id + '-top').remove()

      # Remove the error message under the field
      $('#' + element.id + '-error').remove()

    errorPlacement: (error, element) ->
      # Add errors to the top of the form
      placement = $('#umm-form-errors ul');

      placement.append($('<li></li>').attr('id', element.attr('id') + '-top').append(
        $('<a></a>').attr('href', '#' + element.attr('id')).text(error.text())
      ));
      # Also add the error message to the field (this is the default behavior)
      error.insertAfter(element);

    showErrors: (errorMap, errorList) ->
      unless event.target.classList?.contains('add-new')
        if errorList.length > 0
          $('#umm-form-errors').show()

          # Override the previous message with the new message
          $.each errorList, (index, error) ->
            $('li#' + error.element.id + '-top a').text(error.message)
        else
          $('#umm-form-errors').hide()

        this.defaultShowErrors();

  # If any fields are filled out, validate the entire form
  $('#umm_form fieldset').find(':text, :file, :checkbox, select, textarea').each ->
    if this.value.length > 0
      $('#umm_form').valid()
      false

  $('#umm_form .jump-to-section').on 'change', ->
    # Set all (both) jump to selects to the select value
    $('.jump-to-section').val($(this).val())

    # If the form was invalid (this does not wait for the response from the modal)
    if handleFormNavigation($(this))
      # If the form is valid we have no modal to handle a response, so we'll just
      # submit the form because this generally happens when the user says 'Yes' on
      # the invalid form modal
      $(this).closest('form').submit()

  # If any of the submit buttons in the form nav are clicked we'll validate the form
  $('#umm_form input[type=submit]').on 'click', (e) ->
    handleFormNavigation($(this))

  # If the user choose 'Yes' when asked about saving an invalid form
  $('#invalid-draft-deny').on 'click', ->
    # Revert the jump-to select to it's previous value
    $('.jump-to-section').val(currentJumpToValue)

    # The user doesn't want to save the object, validate the form and display errors
    $('#umm_form').valid()

  # Submit with invalid data
  $('#invalid-draft-accept').on 'click', (e) ->
    e.preventDefault()

    $('#umm_form').submit()
