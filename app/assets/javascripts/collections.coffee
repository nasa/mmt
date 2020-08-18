$(document).ready ->
  $('.delete-collection-in-current-provider').on 'click', (e) ->
    count = $('.collection-granule-count').text()
    if count != 'Granules (0)'
      e.stopImmediatePropagation()

      $('#display-granules-modal').click()

  constructTagsInfo = (tagData) ->
    $tagDisplay = $('<ul/>')
    for tag in tagData
      outer = $('<p/>')

      keyLine = $('<li/>',
        html: "<strong>Tag Key:</strong> #{tag.tag_key}"
      )
      descriptionLine = $('<li/>',
        html: "<strong>Description:</strong> #{tag.description || 'Not provided'}"
      )

      outer.append(keyLine)
      outer.append(descriptionLine)
      $tagDisplay.append(outer)

    $tagDisplay

  constructTagsInfoWithErrors = (tagKeys, error) ->
    $tagDisplay = $('<div/>')

    errorDisplay = $('<div/>',
      class: 'eui-banner--danger'
      html: "There was an error retrieving Tag information: #{error.error}"
    )
    $tagDisplay.append(errorDisplay)

    tagList = $('<ul/>')
    for tagKey in tagKeys
      outer = $('<p/>')

      keyLine = $('<li/>',
        html: "<strong>Tag Key:</strong> #{tagKey}"
      )
      descriptionLine = $('<li/>',
        html: "<strong>Description:</strong> Not retrieved"
      )

      outer.append(keyLine)
      outer.append(descriptionLine)
      $tagDisplay.append(outer)

    $tagDisplay

  $('.col-tag-key-link').on 'click', (e) ->
    # link should only be present if there are tags

    # grab tag keys
    fieldId = $(this).data('colTagKeys') + '_' # id needs the trailing '_' b/c it is an array field
    tagKeys = $("##{fieldId}").val().split(' ')

    $.ajax
      url: "/tags"
      data: {'tag_key': tagKeys, 'gibberish': 'blarg'}

      success: (data, status, xhr) ->
        console.log "got tags! ", JSON.stringify(data)
        tagDisplay = constructTagsInfo(data)
        console.log "constructed: ", JSON.stringify(tagDisplay)
        $('#tag-modal > .tag-keys-display').html(tagDisplay)

      error: (xhr, status, error) ->
        # Can only test error scenario if mess with query params sent in controller
        # console.log "error received: ", error
        # construct tag info
        # debugger
        tagDisplay = constructTagsInfoWithErrors(tagKeys, xhr.responseJSON)
        $('#tag-modal > .tag-keys-display').html(tagDisplay)

    # this was the first implementation, retrieving tags individually
    # tagKeyObj = {}
    # ajax call to get tag description if there is one
    # $.each tagKeys, (index, element) ->
    #   $.ajax
    #     url: "/tags/#{element}"
    #     # method: 'get'
    #     # contentType: 'application/json'
    #     dataType: 'json'
    #     async: false # comment about why needed
    #     # TODO test if can do the search with all tags together
    #     # if so, can create another method to insert html to call
    #
    #     success: (data, status, xhr) ->
    #       console.log "got tag! ", data
    #       tagKeyObj[element] = data
    #     # error: (xhr, status, error) ->

    # console.log "tagKeyObj after getting info: ", JSON.stringify(tagKeyObj)
    # debugger

    # have tag keys and descriptions in json
    # use not provided, or issue grabbing from cmr
      # TODO: ___ ask Alicia about how to display

    # construct text from tag keys and description

    # replace .tag-keys-display text w/ tag keys info
