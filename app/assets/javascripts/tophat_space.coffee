$('document').ready ->
  #checks if tophat exists 
  tophatExist = document.getElementsByClassName("th-wrapper")
  if tophatExist
    $(".wrapper").prepend("<div id='tophat2-space'> </div>")
