$(document).ready ->
  $('.multiple-events').on 'click', ->
    $(this).parents('.eui-banner').find('.is-hidden').removeClass('is-hidden')
    $(this).parent().remove()
