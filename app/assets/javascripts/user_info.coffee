#On Document load, hide the login-info menu by default
$(document).ready ->
  document.getElementById("login-info").style.display = 'none'

#On profile name click show the login-info

$('a.profile-link').on 'click', ->
  console.log("Link Clicked!")
  #document.getElementById("login-info").style.display = 'block'
