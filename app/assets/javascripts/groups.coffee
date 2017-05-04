select2GroupMemberFormatter = (result) ->
  result.text + ' <small><b>' + result.id + '</b></small>'

select2Sorter = (a, b) ->
  if (a.title > b.title)
    return 1
  if (a.title < b.title)
    return -1
  return 0

setCurrentGroupMembers = ->
  $.each $('.urs_autocomplete'), ->
    selectedUsers = $.map $(this).find('option'), (option) -> 
      $(option).val()

    $(this).val(selectedUsers).trigger('change')

$(document).ready ->
  $('.urs_autocomplete').select2
    minimumInputLength: 3
    type: 'GET'
    dataType: 'json'
    ajax:
      delay: 500
      url: '/groups/urs_search'
      data: (params) ->
        search: params.term

      processResults: (data) ->
        results: data
        more: false

    templateResult: (result) ->
      if !result.id
        return result.text

      select2GroupMemberFormatter(result)

    templateSelection: (result) ->
      select2GroupMemberFormatter(result)

    escapeMarkup: (text) ->
      text

    sorter: (data) ->
      # Sort the search results
      data.sort select2Sorter

  .on 'select2:select', (event) ->
    # Sort the selected members each time a new one is added
    $(this).next().find('.select2-selection__rendered li.select2-selection__choice')
      .sort(select2Sorter)
    .prependTo($(this).parent('.select2-selection__rendered'))

  setCurrentGroupMembers()

  if $('.group-form').length > 0
    # Set group params when showing invite-user-modal
    $('.display-invite-user-modal').on 'click', ->
      if $('#group_name').length > 0
        name = $('#group_name').val()
        $('#invite_group_name').val(name)

    $('#invite_first_name, #invite_last_name, #invite_email').on 'blur', ->
      $('.invite-success').addClass('is-invisible')

    $('#invite-user-button').on 'click', (e) ->
      $('.invite-success').addClass('is-invisible')

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
