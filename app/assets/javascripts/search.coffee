$(document).ready ->

  # Toggles advanced search in header
  $('.full-search, .search-form-actions a').click ->
    $(document).trigger 'toggleSearch'

  $(document).on 'toggleSearch', ->
    $('.search-module').toggleClass 'is-hidden'
    $('#search').toggleClass 'open'
    lightbox $(document).height()

  $('#search').submit ->
    # The full search box might be up when clicking on quick find
    # so remove the lightbox
    $('#lightbox').remove()

  # Basic lightbox functionality
  lightbox = (height) ->
    if $('#lightbox').size() == 0
      $('body').append $('<div id="lightbox"/>')
      $('#lightbox').height height
    else
      $('#lightbox').remove()

# Handle presence of Javascript by turning off or on visibility of JS sensitive objects
$('.js-disabled-object').css 'visibility': 'hidden'
$('.js-enabled-object').css 'visibility': 'visible'
