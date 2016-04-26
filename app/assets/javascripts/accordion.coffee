$(document).ready ->
  # Disable toggle
  $('.eui-accordion__header.disable-toggle').unbind('click');

  # Open accordion based on URL hash
  if window.location.hash
    hash = window.location.hash.substring(1)
    $body = $(document.getElementById(hash))
    .find('.eui-accordion__body').first()

    if $body.parent().hasClass('eui-accordion')
      if $body.parent().find('.disable-toggle').length == 0
        $body.slideToggle 'fast', ->
          $(this).parent().toggleClass 'is-closed'
          $('html, body').animate {
            scrollTop: $(this).parent().offset().top
          }, 500

  $('.expand-accordions').on 'click', ->
    $('.eui-accordion.is-closed').removeClass('is-closed')
    $('.eui-accordion__body').slideDown('fast')
    $('.expand-accordions').addClass('is-invisible')
    $('.collapse-accordions').removeClass('is-invisible')

  $('.collapse-accordions').on 'click', ->
    $('.eui-accordion').addClass('is-closed')
    $('.eui-accordion__body').slideUp('fast')
    $('.collapse-accordions').addClass('is-invisible')
    $('.expand-accordions').removeClass('is-invisible')
