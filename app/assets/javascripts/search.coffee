$(document).ready ->

  $('#search').on 'click', 'button', ->
    # Set search_type to whichever button was pressed
    name = $(this).attr('name')
    form = $(this).parents('form')
    $(form).find('#search_type').val name
    form.submit()

  $('#search input').keypress (event) ->
    # Set search_type to whichever form the user pressed enter in
    if event.which == 13
      name = 'quick_find'
      if $(this).parents('section#search').hasClass('open')
        name = 'full_search'
      form = $(this).parents('form')
      $(form).find('#search_type').val name
      form.submit()

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

# Change focus of cursor when search link is clicked on Manage Collections, Manage Variables, or Manage Services pages.
$ ->
 $('#search-focus').on 'click', ->
    document.getElementById('keyword').focus()
    document.getElementById('login-info').style.visibility = 'hidden'
    document.getElementById('dropdown-caret').style.transform = 'rotate(0deg)'
  return

# If search-box has focus then hide the user menu and flip the caret
$ ->
  $('#keyword').on 'click', ->
    document.getElementById('login-info').style.visibility = 'hidden'
    document.getElementById('dropdown-caret').style.transform = 'rotate(0deg)'
