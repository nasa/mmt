$(document).ready ->

  # Implementation of https://github.com/ractoon/jQuery-Text-Counter
  $('.textcounter').textcounter
    # Default behavior is to count up, that's just silly
    countDown: true
    countDownText: '%d Characters Remaining'
    countSpaces: true

    # Style the display
    countContainerElement: 'p'
    countContainerClass: 'form-description align-r'

    # Use the 'maxlength' attribute on the element
    max: 'auto'