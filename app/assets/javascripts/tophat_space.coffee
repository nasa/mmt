$('document').ready ->
  # checks if tophat exists
  if $(".th-wrapper").length
    $(".wrapper").prepend("<div id='tophat2-space'> </div>")
