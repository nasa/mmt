$('document').ready ->
  #checks if tophat exists
  tophatExist = $("#th-wrapper")
  if tophatExist
    $(".wrapper").prepend("<div id='tophat2-space'> </div>")
