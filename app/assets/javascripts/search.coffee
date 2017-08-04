# Before DOM is loaded hide these elements
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
      name = 'keyword'
      if $(this).parents('section#search').hasClass('open')
        name = 'full_search'
      form = $(this).parents('form')
      $(form).find('#search_type').val name
      form.submit()

  # Toggles advanced search in header
  # $('.full-search, .search-form-actions a').click ->
  #  $(document).trigger 'toggleSearch'

  #  $(document).on 'toggleSearch', ->
  #    $('.search-module').toggleClass 'is-hidden'
  #    $('#search').toggleClass 'open'
  #    lightbox $(document).height()

  $('#search').submit ->
    # The full search box might be up when clicking on Search
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

# On search caret click, show search dropdown
$ ->
  $('#search-drop').on 'click', ->
    if $('.search-dropdown').css('display') == 'none'
      $('.search-dropdown').css 'display': 'block'
      $('#search-drop-caret').css 'transform': 'rotate(180deg)'
      $('#search-submit-button').css 'border-bottom': '1px solid #95a5a6'

    else
      $('.search-dropdown').css 'display': 'none'
      $('#search-drop-caret').css 'transform': 'rotate(0deg)'
      $('#search-submit-button').css 'border-bottom': '1px solid transparent'
$ ->
  $('#record_state_published_records').on 'click', ->
    collectionsSelected = $('#record_state_published_records').prop('checked')
    if collectionsSelected
      $("#search-text").text('Search Collections');

  $('#record_state_variables').on 'click', ->
    variablesSelected = $('#record_state_variables').prop('checked')
    if variablesSelected
      $("#search-text").html('<span style="padding-right: 11px;">Search Variables</span>');

# Change focus of cursor when search link is clicked on Manage Collections, Manage Variables, or Manage Services pages.
$ ->
 $('#search-focus').on 'click', ->
    $('#keyword').focus()
    $('#login-info').css 'visibility': 'hidden'
    $('#dropdown-caret').css 'transform': 'rotate(0deg)'
  return

# If search-box has focus then hide the user menu and flip the caret
$ ->
  $('#keyword').on 'click', ->
    $('#login-info').css 'visibility': 'hidden'
    $('dropdown-caret').css 'visibility': 'rotate(0deg)'
    $('keyword').focus()
  return
