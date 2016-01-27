$(document).ready ->
  $('.delete-collection').on 'click', (e) ->
    count = $('.collection-granule-count').text()
    if count != 'Granules (0)'
      e.stopImmediatePropagation()

      $('#display-granules-modal').click()

  # Handle not-current-provider-modal
  $('a.not-current-provider').on 'click', (element) ->
    provider = $(element.target).data('provider')
    action = $(element.target).data('action')

    $modal = $('#not-current-provider-modal')
    $link = $modal.find('a.not-current-provider-link')
    $link.data('provider', provider)

    textAction = switch action
      when 'edit'
        'Editing this collection'
      when 'clone'
        'Cloning this collection'
      when 'delete'
        'Deleting this collection'
      when 'Reinstate'
        action = 'revert'
        'Reinstating this collection'
      when 'Revert to this Revision'
        action = 'revert'
        'Reverting this collection'

    $link.data('type', action)
    $modal.find('span.provider').text(provider)
    $modal.find('span.action').text(textAction)

  $('a.not-current-provider-link').on 'click', (element) ->
    provider = $(element.target).data('provider')
    linkType = $(element.target).data('type')

    $.ajax
      url: "/set_provider?provider_id=#{provider}"
      method: 'post'
      dataType: 'json'
      success: (data, status, xhr) ->
        # Click the link that the user needs
        $("#not-current-provider-#{linkType}-link")[0].click()
