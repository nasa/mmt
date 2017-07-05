$(document).ready ->

  $('.umm-form .jump-to-section').on 'change', ->
    # Set all (both) jump to selects to the select value
    $('.jump-to-section').val($(this).val())

    # Submit the form
    $(this).closest('form').submit()