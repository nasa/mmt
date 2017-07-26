#On Document load, hide the login-info menu by default
$(document).ready ->
  loginInfo = document.getElementById("login-info")
  loginInfo.style.display = 'none'

#On profile name click show the login-info
$ ->
  loginInfo = document.getElementById("login-info")
  dropDownCaret = document.getElementById("dropdown-caret")
  $('#profile-link').on 'click', ->
    if loginInfo.style.display == 'none'
      loginInfo.style.display = 'block'
      dropDownCaret.style.transform = 'rotate(180deg)'
    else
      loginInfo.style.display = 'none'
      dropDownCaret.style.transform = 'rotate(0deg)'
