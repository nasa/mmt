$('document').ready ->
  # checks if tophat exists
  if $(".th-wrapper").length
    $(".wrapper").prepend("<div id='tophat2-space'> </div>")

  # used in the Citation Information preview tab to display the feedback modal
  $('#earthdata-feedback-modal').on 'click', ->
    feedback.showForm()
