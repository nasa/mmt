$(document).ready ->
  # these methods are used in the collection search results table for displaying
  # tag information in the #tags-modal
  # tags on the collection show page are handled in a helper file

  constructSingleTag = (tagKey, tagDescription, defaultDescription) ->
    outer = $('<p/>')

    keyLine = $('<li/>',
      html: "<strong>Tag Key:</strong> #{tagKey}"
    )
    descriptionLine = $('<li/>',
      html: "<strong>Description:</strong> #{tagDescription || defaultDescription}"
    )

    outer.append(keyLine)
    outer.append(descriptionLine)

    outer

  constructTagsInfo = (tagData) ->
    $tagDisplay = $('<ul/>')
    for tag in tagData
      tagGroup = constructSingleTag(tag.tag_key, tag.description, 'Not provided')
      $tagDisplay.append(tagGroup)

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
      tagGroup = constructSingleTag(tagKey, null, 'Not retrieved')
      $tagDisplay.append(tagGroup)

    $tagDisplay

  $('.col-tag-key-link').on 'click', (e) ->
    # link should only be present if there are tags

    # grab tag keys
    fieldId = $(this).data('colTagKeys') + '_' # id needs the trailing '_' b/c it is an array field
    tagKeys = $("##{fieldId}").val().split(' ')

    $.ajax
      url: "/tags"
      data: {'tag_key': tagKeys}

      success: (data, status, xhr) ->
        tagDisplay = constructTagsInfo(data)
        $('#tags-modal > .tag-keys-display').html(tagDisplay)

      error: (xhr, status, error) ->
        tagDisplay = constructTagsInfoWithErrors(tagKeys, xhr.responseJSON)
        $('#tags-modal > .tag-keys-display').html(tagDisplay)
