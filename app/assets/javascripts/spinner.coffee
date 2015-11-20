$(document).ready ->
  $('a.spinner').on 'click', ->
    $(this).hide()
    classes = $(this).attr('class')
    $spinner = $("<span class='#{classes}'><i class='fa fa-circle-o-notch fa-spin'></i> Loading</span>")
    $spinner.insertAfter($(this))
