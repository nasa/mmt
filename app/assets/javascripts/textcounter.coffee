@initializeTextcounter = (options) ->
  # Remove all previous counters
  $('.textcounter-container').remove()

  defaultOptions =
    # Default behavior is to count up, that's just silly
    countDown: true
    countDownText: '%d Characters Remaining'
    countSpaces: true

    # Style the display
    countContainerElement: 'p'
    countContainerClass: 'textcounter-container form-description align-r'

    # Use the 'maxlength' attribute on the element
    max: 'auto'

  # Add counter to all necessary fields
  $('.textcounter').textcounter $.extend(defaultOptions, options)

  # TODO: this is triggering validation error messages on page load. can it be taken out?
  $('.textcounter').trigger('blur')

$(document).ready ->
  # Handle all fields that appears on page load
  initializeTextcounter()
