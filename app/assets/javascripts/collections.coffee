$(document).ready ->
  $('.delete-collection').on 'click', (e) ->
    count = $('.collection-granule-count').text()
    if count != 'Granules (0)'
      e.stopImmediatePropagation()

      $('#display-granules-modal').click()
