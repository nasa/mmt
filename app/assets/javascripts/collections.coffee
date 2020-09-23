$(document).ready ->
  $('.delete-collection-in-current-provider').on 'click', (e) ->
    if numGranules > 0 || numVariables > 0
      e.stopImmediatePropagation()

      $('#display-cascade-delete-modal').click()
