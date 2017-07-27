#On Document load, hide the login-info menu by default
$(document).ready ->
  loginInfo = document.getElementById("login-info")
  loginInfo.style.visibility = 'hidden'

#On profile name click show the login-info
$ ->
  loginInfo = document.getElementById("login-info")
  dropDownCaret = document.getElementById("dropdown-caret")
  $('#profile-link').on 'click', ->
    if loginInfo.style.visibility == 'hidden'
      loginInfo.style.visibility = 'visible'
      dropDownCaret.style.transform = 'rotate(180deg)'
#On profile name click hide the login-info
    else
      loginInfo.style.visibility = 'hidden'
      dropDownCaret.style.transform = 'rotate(0deg)'

#On hover highlight both the link and the caret
$ ->
  hov = $('#profile-link').hover \
  (-> $('.prof-link-container').addClass 'hoverOver'), \
  (-> $('.prof-link-container').removeClass 'hoverOver'),
