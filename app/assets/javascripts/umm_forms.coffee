handleFormNavigation = (element) ->
  # When we hijack a click like this we lose the button that we pressed,
  # so we've added a hidden field to the form and will record it there
  $('#commit').val(element.val())

  # Check the form validity
  formIsValid = element.closest('form').validate().checkForm();

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
  $('.umm-form').validate
    onsubmit: false

  $('.umm-form .jump-to-section').on 'change', ->
    # Set all (both) jump to selects to the select value
    $('.jump-to-section').val($(this).val())

    # If the form was invalid (this does not wait for the response from the modal)
    if handleFormNavigation($(this))
      # If the form is valid we have no modal to handle a response, so we'll just
      # submit the form because this generally happens when the user says 'Yes' on
      # the invalid form modal
      $(this).closest('form').submit()

  # If any of the submit buttons in the form nav are clicked we'll validate the form
  $('.umm-form input[type=submit]').on 'click', (e) ->
    handleFormNavigation($(this))    

  # If the user choose 'Yes' when asked about saving an invalid form
  $('#invalid-draft-deny').on 'click', ->
    # Revert the jump-to select to it's previous value
    $('.jump-to-section').val(currentJumpToValue)

    # Call blur on all of our form fields to validate them
    $("#umm_form input:visible").blur()

  # Submit with invalid data
  $('#invalid-draft-accept').on 'click', ->
    $(this).closest('form').submit()