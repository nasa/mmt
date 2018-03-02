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
      when 'reinstate-service'
        action = 'revert'
        'Reinstating this service'
      when 'revert-service'
        action = 'revert'
        'Reverting this service'
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
      when 'edit-service'
        'Editing this service'
      when 'clone-service'
        'Cloning this service'
      when 'delete-variable'
        if associatedCollections > 0
          "This variable is associated with #{associatedCollections} collections. Deleting this variable will also delete the collection associations, and"
        else
          'Deleting this variable'
      when 'delete-service'
        'Deleting this service'
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
          return window.location = response.redirect if response.redirect?

          $providerContextSelect = $('#select_provider')
          $searchProviderSelect = $('#provider_id')
          $groupProviderFilter = $('#provider-group-filter')

          $noProviders = $('.provider-context-no-providers')
          $oneProvider = $('.provider-context-one-provider')
          $manyProviders = $('.provider-context-many-providers')

          $noProviders.hide()
          $oneProvider.hide()
          $manyProviders.hide()

          # refresh the user's available providers in the list
          if response.available_providers.length > 1
            $manyProviders.show()

            $providerContextSelect.empty()
            $providerContextSelect.append($('<option>').text('Select Provider'))
            $.each response.available_providers, (index, value) ->
              $providerContextSelect.append($('<option>').val(value).text(value).attr('selected', response.provider_id == value))
          else if response.available_providers.length == 1
            $oneProvider.show()


          $('span.refresh-providers.spinner').remove()
          $('a.refresh-providers.spinner').show()

          # refresh the lists of all providers if there has been a change
          if response.refresh_all_providers
            $searchProviderSelect.empty()
            $searchProviderSelect.append($('<option>').text('Select a Provider'))
            $.each response.all_providers, (index, value) ->
              $searchProviderSelect.append($('<option>').val(value[1]).text(value[0]))

            if $groupProviderFilter.length > 0
              # only update the groups provider filter if it is on the page
              $groupProviderFilter.empty()
              $.each response.all_providers, (index, value) ->
                $groupProviderFilter.append($('<option>').val(value[1]).text(value[0]))
              $groupProviderFilter.select2()
