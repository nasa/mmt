#On Document load, hide the login-info menu by default
$ ->
  $('#login-info').css('visibility': 'hidden')

#On profile name click show the login-info
$ ->
  $('#profile-link').on 'click', ->
    if $('#login-info').css('visibility') == 'hidden'
      $('#login-info').css('visibility': 'visible')
      $('#dropdown-caret').css('transform': 'rotate(180deg)')
    else
      $('#login-info').css('visibility': 'hidden')
      $('#dropdown-caret').css('transform': 'rotate(0deg)')

#On hover highlight both the link and the caret
$ ->
  hov = $('#profile-link').hover \
  (-> $('.prof-link-container').addClass 'hoverOver'), \
  (-> $('.prof-link-container').removeClass 'hoverOver'),
