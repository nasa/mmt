$(document).ready ->
  $('a.spinner, input.spinner, button.spinner').on 'click', ->
    console.log(this)
    $(this).hide()
    classes = $(this).attr('class')
    console.log(this)
    $spinner = $("<span class='#{classes}'><i class='fa fa-circle-o-notch fa-spin'></i> Loading</span>")
    console.log(this)
    $spinner.insertAfter($(this))
    console.log(this, $spinner)
