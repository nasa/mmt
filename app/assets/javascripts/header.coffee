$(document).ready ->

  $('#select-provider').on 'change', ->
    if this.value != ''
      window.location.href = '/set_provider?provider_id=' + this.value
