$(document).ready ->
  $('#select_all_members').on 'change', ->
    if this.checked
      $('.remove-member-checkbox').prop 'checked', true
    else
      $('.remove-member-checkbox').prop 'checked', false
    updateRemoveButton()

  $('.remove-member-checkbox').on 'change', ->
    updateRemoveButton()

  updateRemoveButton = ->
    # if any checkboxes are selected, enable button
    if $('.remove-member-checkbox:checked').length > 0
      $('#remove-selected-members').prop 'disabled', false
      $('#remove-selected-members').removeClass 'disabled'
    else
      # else disable button
      $('#remove-selected-members').prop 'disabled', true
      $('#remove-selected-members').addClass 'disabled'

  $('#remove-selected-members').on 'click', ->
    if !$(this).hasClass('disabled')
      $(this).parents('form').submit()


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

  $('.system-group-checkbox').on 'change', ->
    $box = $(this)
    provider = $('.provider-context > span').text()
    $title = $('.new-group-title')
    $span = $('.new-group-badge')
    if $box.prop 'checked'
      $title.text($title.text().replace provider, 'CMR')
      $span.text('SYS')
      $span.addClass('eui-badge--sm')
    else
      $title.text($title.text().replace 'CMR', provider)
      $span.text('')
      $span.removeClass('eui-badge--sm')
