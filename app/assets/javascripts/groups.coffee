$(document).ready ->
  if $('.group-form').length > 0

    # Validate group form
    $('.group-form').validate
      rules:
        'group[name]':
          required: true
        'group[description]':
          required: true
      messages:
        'group[name]':
          required: 'Name is required.'
        'group[description]':
          required: 'Description is required.'


    # Set group params when showing invite-user-modal
    $('.display-invite-user-modal').on 'click', ->
      if $('#group_name').length > 0
        name = $('#group_name').val()
        $('#invite_group_name').val(name)

    $('#invite_first_name, #invite_last_name, #invite_email').on 'blur', ->
      $('.invite-success').addClass('is-invisible')

    $('#invite-user-button').on 'click', (e) ->
      $('.invite-success').addClass('is-invisible')
      $('.invite-fail').addClass('is-invisible')

      firstName = $('#invite_first_name').val()
      lastName = $('#invite_last_name').val()
      email = $('#invite_email').val()

      if firstName.length == 0 || lastName.length == 0 || email.length == 0
        e.preventDefault()

    $('#invite-user-modal').on 'click', '.modal-close', ->
      $('.invite-success').addClass('is-invisible')

      firstName = $('#invite_first_name').val('')
      lastName = $('#invite_last_name').val('')
      email = $('#invite_email').val('')

    # We're using 'readonly' instead of 'disabled' which still
    # allows the following actions so we're manually disabling them
    $('.system-group-checkbox[readonly]')
      .on 'click', ->
        false
      .on 'keydown', ->
        false

    $('.system-group-checkbox:not([readonly])').on 'change', ->
      # Pull aside the provider string
      provider = $('.provider-context > span').text()

      # Toggle the display of the SYS badge
      $('#badge-container').toggle()

      # Toggle the provider based on whether or not the
      # System Level Group checkbox is checked
      if this.checked
        $('h2 .provider-context').text('CMR')
      else
        $('h2 .provider-context').text(provider)
