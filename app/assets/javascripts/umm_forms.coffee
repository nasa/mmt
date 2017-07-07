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
  currentJumpToValue = $('.jump-to-section').val()
  # $('.jump-to-section').data('previous', currentJumpToValue)

  $('.umm-form .jump-to-section').on 'change', ->
    # selectedValue = $(this).val()

    # Set all (both) jump to selects to the select value
    $('.jump-to-section').val($(this).val())

    if handleFormNavigation($(this))
      $(this).closest('form').submit()

  $('.umm-form').validate
    onsubmit: false

  $('.umm-form input[type=submit]').on 'click', (e) ->
    handleFormNavigation($(this))    

  # If the user choose 'Yes' when asked about saving an invalid form
  $('#invalid-draft-deny').on 'click', ->
    $('.jump-to-section').val(currentJumpToValue)
    $(".umm_form").validate()
    $("#umm_form input:visible").blur()

  $('#invalid-draft-accept').on 'click', ->
    $(this).closest('form').submit()