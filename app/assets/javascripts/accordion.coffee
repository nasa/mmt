$(document).ready ->
  # Disable toggle
  $('.eui-accordion__header.disable-toggle').unbind('click');

  # Open accordion based on URL hash
  if window.location.hash
    hash = window.location.hash.substring(1)
    $body = $(document.getElementById(hash))
    .find('.eui-accordion__body').first()

    if $body.parent().hasClass('eui-accordion')
      $body.slideToggle 'fast', ->
        $(this).parent().toggleClass 'is-closed'
        $('html, body').animate {
          scrollTop: $(this).parent().offset().top
        }, 500
