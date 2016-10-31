$(document).ready ->
  $('.multiple-events').on 'click', ->
    $(this).parent().parent().find('.eui-banner__message.is-hidden').removeClass('is-hidden')
    $(this).parent().remove()
