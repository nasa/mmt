$('document').ready ->
  # checks if tophat exists
  tophatExist = $(".th-wrapper")
  if tophatExist.length
    $(".wrapper").prepend("<div id='tophat2-space'> </div>")
