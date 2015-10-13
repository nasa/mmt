$(document).ready ->

  # Toggles advanced search in header
  $('.full-search, .search-form-actions button, .search-form-actions a').on 'click', ->
    $(document).trigger('toggleSearch')

  $(document).on 'toggleSearch', ->
    $('.search-module').toggleClass('is-hidden')

    pageHeight = $(document).height() - 164 # Header height

    lightbox(pageHeight)

  $('#search').submit ->
    # The full search box might be up when clicking on quick find
    # so remove the lightbox
    $('#lightbox').remove()

  # Basic lightbox functionality
  lightbox = (height) ->
    if $('#lightbox').size() == 0
      lightbox = $('<div id="lightbox"/>')
      $('body').append(lightbox)
      $('#lightbox').height(height)
    else
      $('#lightbox').remove()

# Handle presence of Javascript by turning off or on visibility of JS sensitive objects
$('.js-disabled-object').css({'visibility': 'hidden'})
$('.js-enabled-object').css({'visibility': 'visible'})

updateCollectionSearchInput = (entryId, sort, page, pushUrl) ->
  targetUrl = 'search'
  paramString = window.location.search
  paramArray = paramString.slice(1).split('&')
  newParamArray = []

  i = 0
  while i < paramArray.length
    param = paramArray[i]
    parts = param.split('=')
    if parts[0].length > 0 and parts[0] != 'page' and parts[0] != 'sort' and parts[0] != entry_id
      newParamArray.push param
    i++

  newParamArray.push 'page=' + page
  #newParamArray.push('sort=' + sort);
  queryParams = 'page=' + page + '&sort=' + sort

  if entryId and entryId.length != 0
    newParamArray.push 'entry_id=' + entryId
  queryParams = newParamArray.join('&')

  if history.pushState
    if pushUrl
      newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + queryParams
      window.history.pushState { path: newurl }, '', newurl

  $.ajax
    type: 'GET'
    dataType: 'script'
    url: targetUrl
    data: queryParams

  false

getURLParameter = (name) ->
  if name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(location.search)
    return decodeURIComponent(name[1])
  return

$(window).on 'popstate', ->
  # Refresh the contents page using AJAX. Extract & use the parameters from the "backed" url
  page = getURLParameter('page')
  if page != null
    updateCollectionSearchInput getURLParameter('entry_id') or '', getURLParameter('sort') or '', getURLParameter('page') or '', false

@goToPage = (page) ->
  updateCollectionSearchInput $('#entry_id').val(), $('#sort').val(), page, true
