#On Document load, hide the login-info menu by default
$(document).ready ->
  document.getElementById("login-info").style.display = 'none'

#On profile name click show the login-info
$('.profile-link').on 'click', ->
  document.getElementById("login-info").style.display = 'block'
