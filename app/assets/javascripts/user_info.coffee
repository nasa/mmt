#On Document load, hide the login-info menu by default
$(document).ready ->
  loginInfo = document.getElementById("login-info")
  document.getElementById("login-info").style.display = 'none'

#On profile name click show the login-info

$ ->
  $('#profile-link').on 'click', ->
    if document.getElementById("login-info").style.display == 'none'
      document.getElementById("login-info").style.display = 'block'
      document.getElementById("dropdown-caret").style.transform = 'rotate(180deg)'
    else
      document.getElementById("login-info").style.display = 'none'
      document.getElementById("dropdown-caret").style.transform = 'rotate(0deg)'
