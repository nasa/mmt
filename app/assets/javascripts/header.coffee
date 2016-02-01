$(document).ready ->

  $('#select_provider').on 'change', ->
    if this.value != ''
      this.form.submit()
