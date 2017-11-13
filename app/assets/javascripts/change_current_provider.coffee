$(document).ready ->
  $('.display-modal').leanModal
    top: 200
    overlay: 0.6
    closeButton: '.modal-close'

  # Handle not-current-provider-modal
  $('a.not-current-provider').on 'click', (element) ->
    provider = $(element.target).data('provider')
    action = $(element.target).data('recordAction')
    href = $(this).attr('href')
    associatedCollections = $(element.target).data('numAssociatedCollections')

    $modal = $(href)
    $link = $modal.find('a.not-current-provider-link')
    $link.data('provider', provider)

    textAction = switch action
      when 'edit-collection'
        'Editing this collection'
      when 'clone-collection'
        'Cloning this collection'
      when 'delete-collection'
        'Deleting this collection'
      when 'reinstate-collection'
        action = 'revert'
        'Reinstating this collection'
      when 'revert-collection'
        action = 'revert'
        'Reverting this collection'
      when 'reinstate-variable'
        action = 'revert'
        'Reinstating this variable'
      when 'revert-variable'
        action = 'revert'
        'Reverting this variable'
      when 'view-draft'
        'Viewing this draft'
      when 'edit-draft'
        'Editing this draft'
      when 'edit-group'
        'Editing this group'
      when 'delete-group'
        'Deleting this group'
      when 'edit-variable'
        'Editing this variable'
      when 'clone-variable'
        'Cloning this variable'
      when 'delete-variable'
        if associatedCollections > 0
          "This variable is associated with #{associatedCollections} collections. Deleting this variable will also delete the collection associations, and"
        else
          'Deleting this variable'
      when 'manage-variable-associations'
        "Managing this variable's collection associations"

    $link.data('type', action)
    $modal.find('span.provider').text(provider)
    $modal.find('span.record-action').text(textAction)

  $('a.not-current-provider-link').on 'click', (element) ->
    provider = $(element.target).data('provider')
    linkType = $(element.target).data('type')
    index = $(element.target).data('index')

    link = "#not-current-provider-#{linkType}-link"
    link += "-#{index}" if index != false

    $.ajax
      url: "/set_provider?provider_id=#{provider}"
      method: 'post'
      dataType: 'json'

      success: (data, status, xhr) ->
        # Click the link that the user needs
        $(link)[0].click()

  # Change current provider
  $('#change-current-provider-banner-link').on 'click', (element) ->
    provider = $(element.target).data('provider')
    actionLink = $(element.target).data('actionLink')

    $.ajax
      url: "/set_provider?provider_id=#{provider}"
      method: 'post'
      dataType: 'json'

      success: (data, status, xhr) ->
        $("##{actionLink}")[0].click()

  $('#refresh-available-providers-link').on 'click', (element) ->
    if $(this).hasClass('spinner')
      $.ajax
        url: '/refresh_providers'
        method: 'get'
        dataType: 'json'

        success: (response) ->
          $('#select_provider').empty()
          $('#select_provider').append($('<option>').text('Select Provider'))

          $.each response.items, (index, value) ->
            $('#select_provider').append($('<option>').val(value).text(value))

          $('span.refresh-providers.spinner').remove()
          $('a.refresh-providers.spinner').show()
