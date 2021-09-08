# Shape file uploads
# These need to be outside of the $(document).ready in order to initialize the
# dropzone correctly.
csrf = undefined
if typeof document.querySelector == 'function'
  if document.querySelector('meta[name=csrf-token]')
    csrf = document.querySelector('meta[name=csrf-token]').content
Dropzone.options.shapeFileUpload =
  url: '/convert'
  paramName: 'upload'
  headers: 'X-CSRF-Token': csrf
  clickable: '.geojson-dropzone-link'
  uploadMultiple: false
  createImageThumbnails: false
  dictDefaultMessage: ''
  success: (file, response) ->
    $.each response.features, (index, feature) ->
      if feature.geometry.type == 'Point'
        # click point radio button
        $('.geometry-picker.points').click()
        hasPoints = false
        lastPoint = $('.multiple.points').first().find('.multiple-item').last()
        $.each $(lastPoint).find('input'), (index, element) ->
          if $(element).val() != ''
            hasPoints = true
            return false

        if hasPoints
          $('.multiple.points').first().find('.actions > .add-new').click()

        lastPoint = $('.multiple.points').first().find('.multiple-item').last()
        points = feature.geometry.coordinates
        $(lastPoint).find('.longitude').val points[0]
        $(lastPoint).find('.latitude').val points[1]
        $(lastPoint).find('.longitude').trigger 'change'
      else if feature.geometry.type == 'Polygon'
        # click polygon radio button
        $('.geometry-picker.g-polygons').click()
        if feature.geometry.coordinates[0].length > 50
          $(file.previewElement).addClass 'dz-error'
          $(file.previewElement).find('.dz-error-message > span').text 'Too many points in polygon'
        else
          # if last polygon has points, click add another polygon
          hasPoints = false
          lastPolygon = $('.multiple.g-polygons > .multiple-item').last()
          $.each $(lastPolygon).find('input'), (index, element) ->
            if $(element).val() != ''
              hasPoints = true
              return false

          if hasPoints
            $('.multiple.g-polygons > .actions > .add-new').click()

          # loop through coordinates and add points to last polygon
          lastPolygon = $('.multiple.g-polygons > .multiple-item').last()
          lastPolygonPoint = $(lastPolygon).find('.boundary .multiple.points > .multiple-item').last()
          $.each feature.geometry.coordinates[0], (index, coordinate) ->
            if index > 0
              $(lastPolygon).find('.boundary .multiple.points > .actions > .add-new').click()
              lastPolygonPoint = $(lastPolygon).find('.boundary .multiple.points > .multiple-item').last()
            $(lastPolygonPoint).find('.longitude').val coordinate[0]
            $(lastPolygonPoint).find('.latitude').val coordinate[1]

          $(lastPolygonPoint).find('.longitude').trigger 'change'


$(document).ready ->
  extractType = (topMultiple) ->
    type = $(topMultiple).attr('class').split(' ').pop().replace(/-/g, '_')
    # if a UMM form, just use the last piece of type
    type = type.split('/').pop() if $(this).parents('.umm-form').length > 0
    return type

  changeHeaderNumbers = (newDiv, targetIndex = null) ->
    $.each $(newDiv).find('.eui-accordion__header .header-title'), (index, field) ->
      headerHtml = $(field).html()
      headerIndex = headerHtml.match(/\d+/)
      targetIndex = if targetIndex then targetIndex else parseInt(headerIndex) + 1
      if headerIndex != undefined
        if index == 0
          $(field).html headerHtml.replace(headerIndex, targetIndex)
        else
          $(field).html headerHtml.replace(headerIndex, 1)

    # Increment index on toggle link in accordion header, set all others to 1
    $.each $(newDiv).find('.eui-accordion__header .eui-accordion__icon span'), (index, field) ->
      headerHtml = $(field).html()
      headerIndex = headerHtml.match(/\d+/)
      targetIndex = if targetIndex then targetIndex else parseInt(headerIndex) + 1
      if headerIndex != undefined
        if index == 0
          $(field).html headerHtml.replace(headerIndex, targetIndex)
        else
          $(field).html headerHtml.replace(headerIndex, 1)

  # Adding another element (clicking to 'Add another <fieldset>')
  $('.metadata-form .multiple, .umm-form .multiple').on 'click', '.add-new', (e) ->

    $('.select2-select').select2('destroy')

    simple = $(this).hasClass('new-simple')
    topMultiple = $(this).closest('.multiple')

    type = extractType(topMultiple)

    multipleItem = topMultiple.children('.multiple-item:last')
    newDiv = multipleItem.clone(true)

    multipleIndex = getIndex(multipleItem)
    $(newDiv).removeClass('multiple-item-' + multipleIndex).addClass 'multiple-item-' + (multipleIndex + 1)
    if simple
      # multiple-item is a simple field with no index (just a text field)

      # clone parent and clear field
      $.each $(newDiv).find('select, input, textarea'), (index, field) ->
        $(field).val ''

      newDiv = changeElementIndex(newDiv, multipleIndex, multipleIndex + 1, true, type)
      $(newDiv).appendTo topMultiple
    else
      # multiple-item is a collection of fields

      # Remove any extra multiple-item, should only be one per .multiple
      $.each $(newDiv).find('.multiple').not('.multiple.addresses-street-addresses, .multiple.street-addresses'), (index, multiple) ->
        $.each $(multiple).children('.multiple-item'), (index2) ->
          if index2 > 0
            $(this).remove()

      newDiv = changeElementIndex(newDiv, multipleIndex, multipleIndex + 1, false, type)
      $(newDiv).insertAfter multipleItem

      # close last accordion and open all new accordions
      $(multipleItem).addClass 'is-closed'
      $(newDiv).find('.eui-accordion').removeClass 'is-closed'

      changeHeaderNumbers(newDiv)

      initializeTextcounter()

    # remove validation errors
    $(newDiv).find('.validation-error').remove()

    $(newDiv).find('select, input, textarea').removeAttr 'disabled'
    $(newDiv).find('select, input, textarea').not('.readonly').removeAttr 'readonly'
    $(newDiv).find('select, input, textarea').not('input[type="hidden"]')[0].focus()
    $(newDiv).find('.data-contact-type').hide()

    # diable RelatedURLs Type and Subtype fields
    $(newDiv).find('.related-url-type-select, .related-url-subtype-select').addClass 'disabled'
    $(newDiv).find('.related-url-type-select, .related-url-subtype-select').prop 'disabled', true

    # trigger controlled keyword consequences for adding a new measurement quantity in UMM-V
    if $('.measurement-quantity-select')?.length > 0 && $(newDiv).find('.measurement-context-medium-select')?.length == 0
      $(newDiv).closest('.eui-accordion__body').find('.measurement-object-select').trigger('change')

    # trigger controlled keyword consequences for adding a new measurement context medium in UMM-V
    $(newDiv).find('.measurement-context-medium-select').trigger('change')

    # Remove points from preview link
    $.each $(newDiv).find('.spatial-preview-link'), ->
      url = $(this).attr('href').split('?')[0]
      $(this).attr 'href', url

    $('.select2-select').select2({ width: '100%' })

    # Remove all required icons
    $(newDiv).find('label.eui-required-o').not('label.always-required').removeClass('eui-required-o')
    $(newDiv).find('label.eui-required-grey-o').removeClass('eui-required-grey-o')

    e.stopImmediatePropagation()


  changeElementIndex = (newDiv, multipleIndex, targetIndex, simple, type) ->
    # 'type' is different with composed_of/instrument_children
    # than the rest of the forms. If we see instrument_children
    # here we really want to increment the composed_of index
    type = 'composed_of' if type == 'instrument_children'
    # we need type to be axis because individual fieldsets and fields use that,
    # but the topMultiple label and class gets pluralized into axes
    type = 'axis' if type == 'axes'
    # File Archive Information and File Distribution Information got plural, so
    # here is the need to remove the 's'
    type = 'file_archive_information' if type == 'file_archive_informations'
    type = 'file_distribution_information' if type == 'file_distribution_informations'

    # Find the index that needs to be incremented
    if simple
      firstElement = $(newDiv).find('select, input, textarea').first()
    else
      firstElement = $(newDiv).find('select, input, textarea').not('.simple-multiple-field').first()

    # if the first element doesn't have a name attribute,
    # like TemporalRangeType (UMM-C 1.10)
    # then the nameIndex is incorrectly calculated,
    # so trying using the last element instead
    unless $(firstElement).attr('name')?
      firstElement = $(newDiv).find('select, input, textarea').not('.simple-multiple-field').last()

    nameIndex = $(firstElement).attr('name').lastIndexOf("#{type}][#{multipleIndex}]")
    idIndex = $(firstElement).attr('id').lastIndexOf("#{type}_#{multipleIndex}")

    # Update newDiv's id
    id = $(newDiv).attr('id')
    if id?
      id = id.slice(0, idIndex) + id.slice(idIndex).replace(multipleIndex, targetIndex)
      $(newDiv).attr 'id', id

    # Loop through newDiv and increment the correct index
    $.each $(newDiv).find("select, input, textarea, label, div[id*='_#{type}_#{multipleIndex}']"), (index, field) ->
      # Remove the aria-describedby attribute for brand new fields
      $(field).attr('aria-describedby', '')

      if $(field).is('input, textarea, select')
        name = $(field).attr('name')

        if name?
          # in the case where 'type' contains a number, we want to slice past the 'type' (hence adding type.length)
          # so as not to confuse the number in the 'type' with the index that needs to be replaced
          nameIndex += if /\d/.test(type) then type.length  else 0
          name = name.slice(0, nameIndex) + name.slice(nameIndex).replace(multipleIndex, targetIndex)
          $(field).attr 'name', name

        id = $(field).attr('id')
        # in the case where 'type' contains a number, we want to slice past the 'type' (hence adding type.length)
        # so as not to confuse the number in the 'type' with the index that needs to be replaced
        idIndex += if /\d/.test(type) then type.length  else 0
        id = id.slice(0, idIndex) + id.slice(idIndex).replace(multipleIndex, targetIndex)
        $(field).attr 'id', id

        if $('.metadata-form, .umm-form').length > 0
          dataLevel = $(field).attr('data-level')
          dataLevel = dataLevel.slice(0, idIndex) + dataLevel.slice(idIndex).replace(multipleIndex, targetIndex)
          # TODO for some reason, incrementing on the page does not happen without the .attr call,
          # but required fields does not work properly without the .data call
          $(field).data('level', dataLevel)
          $(field).attr('data-level', dataLevel)
          # console.log 'after trying to update: ', $(field).data('level')
          # console.log 'but actually ', $(field).attr('data-level')

        # Clear field value
        if $(field).attr('type') == 'radio'
          $(field).prop 'checked', false
        else
          $(field).not('input[type="hidden"]').val ''
          # $(field).not('input[type="hidden"]').attr('value', '')

      else if $(field).is('label')
        # keep always required icons, remove conditionally required icons
        if $(field).hasClass('required') && !$(field).hasClass('always-required')
          $(field).removeClass('eui-required-o')

        labelFor = $(field).attr('for')

        if labelFor != undefined
          labelFor = labelFor.slice(0, idIndex) + labelFor.slice(idIndex).replace(multipleIndex, targetIndex)
          $(field).attr 'for', labelFor

      else if $(field).is('div')
        # also increment the id for data contacts divs
        id = $(field).attr('id')
        id = id.slice(0, idIndex) + id.slice(idIndex).replace(multipleIndex, targetIndex)
        $(field).attr 'id', id

    newDiv

  $('.metadata-form .multiple, .umm-form .multiple').on 'click', '.remove', (e) ->
    multipleItem = $(this).closest('.multiple-item')
    if !multipleItem.siblings('.multiple-item').length
      # This is required to get the short name selector to properly renumber.
      $('.select2-select').select2('destroy')
      # Reset the form state to original page load.
      # Adding another and deleting causes the formatting to break, so this is
      # clearing out the existing fields instead.
      # In order to return the document to the original state, the document needs
      # to clear the Country/RelatedURLs before they would be cleared by changing
      # the contact type, so go up the document in reverse
      $(multipleItem.find('select:not([disabled="disabled"]):not(.disabled)').get().reverse()).each (index, element) ->
        elem = $(element)
        if elem.prop('selectedIndex')
          elem.prop('selectedIndex', 0).change()
      multipleItem.find('.eui-accordion__body').find('.multiple-item').each (index, element) ->
        scrubElement(element)
      scrubElement(multipleItem)
      multipleItem.find('input').val('')
      $('.select2-select').select2()
      # Prevent validation from displaying an error for a required field.
      e.stopImmediatePropagation()
    else
      $(multipleItem).remove()

  getIndex = (multipleItem) ->
    classMatch = $(multipleItem).attr('class').match(/multiple-item-(\d+)/)
    if classMatch == null
      false
    else
      parseInt classMatch[1]

  scrubElement = (element) ->
    elem = $(element)
    if elem.siblings('.multiple-item').length
      # Programmatically clicking the remove rather than calling .remove()
      # means the extra address lines do not need to be hard coded to be excluded.
      elem.find('a.remove').click()
    else
      # If the index isn't zero, the headers and index numbers need to be adjusted
      # in order to reset to fresh page load
      multipleIndex = getIndex(elem)
      if multipleIndex != 0
        simple = $(elem).closest('.multiple').hasClass('simple-multiple')
        type = extractType($(elem).parent())
        $(elem).closest('.multiple-item').removeClass('multiple-item-' + multipleIndex).addClass 'multiple-item-0'
        changeHeaderNumbers(elem, 1)
        changeElementIndex(elem, multipleIndex, 0, simple, type)

  $('.latitude, .longitude').on 'change', ->
    coordinates = []
    previewLink = $(this).parents('.eui-accordion__body').find('.spatial-preview-link')
    if previewLink.length > 0
      url = $(previewLink).attr('href').split('map')[0]
      # if point has both latitude and longitude points, generate a link
      if $(this).parents('.boundary').length > 0
        # loop through all points and add to coordinates
        $.each $(this).parents('.boundary').find('input'), (index, element) ->
          coordinates.push $(element).val()

        if coordinates.length % 2 == 0
          $(previewLink).attr 'href', url + 'map?polygon=' + encodeURIComponent(coordinates.join(','))
      else
        if $(this).hasClass('latitude')
          latitude = $(this).val()
          longitude = $(this).parent().siblings().find('.longitude').val()
        else
          latitude = $(this).parent().siblings().find('.latitude').val()
          longitude = $(this).val()

        if latitude != '' and longitude != ''
          coordinates.push [
            longitude
            latitude
          ]
          $(previewLink).attr 'href', url + 'map?sp=' + encodeURIComponent(coordinates.join(','))

  $('.bounding-rectangle-point').on 'change', ->
    coordinates = []
    previewLink = $(this).parents('.eui-accordion__body').find('.spatial-preview-link')
    url = $(previewLink).attr('href').split('map')[0]

    parent = $(this).parents()
    west = $(parent).find('.bounding-rectangle-point.west').val()
    south = $(parent).find('.bounding-rectangle-point.south').val()
    east = $(parent).find('.bounding-rectangle-point.east').val()
    north = $(parent).find('.bounding-rectangle-point.north').val()
    if west.length > 0 and south.length > 0 and east.length > 0 and north.length > 0
      coordinates = [
        west
        south
        east
        north
      ]
      $(previewLink).attr 'href', url + 'map?sb=' + encodeURIComponent(coordinates.join(','))

  # trigger changes on page load to generate links
  $.each $('.multiple.points .longitude, .bounding-rectangle-point.west').not('.multiple.lines .longitude, .exclusive-zone .longitude'), (index, element) ->
    if $(element).val().length > 0
      $(element).trigger 'change'

  # Load State/Province field on Country select
  $('.metadata-form select.country-select').change ->
    $parent = $(this).closest('.multiple-item')
    $select = $parent.find('.state-province-select')
    $text = $parent.find('.state-province-text-field')

    countryCode = encodeURIComponent($(this).val())
    $select.val('')
    $text.val('')
    $text.removeClass('disabled')

    # If a country was selected, refresh the options
    if countryCode != ''
      $text.hide()
      $text.prop 'disabled', true
      $select.show()
      $select.prop 'disabled', false

      url = "/subregion_options?parent_region=#{countryCode}"
      if ($(this).parents('.proposal-mode').length)
        url = "/proposal/subregion_options?parent_region=#{countryCode}"
      $select.load url, (e) ->
        # if 'Select State/Province is only option
        if $(e).length < 2
          # show disabled text field
          $text.show()
          $text.addClass('disabled')
          $select.hide()
          $select.prop 'disabled', true
    else
      # No country selected, show the text field
      $select.hide()
      $select.prop 'disabled', true
      $text.show()
      $text.prop 'disabled', false

  # Handle Data Contacts form on load
  # disable hidden form elements so blank values don't interevere with data being saved/resaved
  $('.data-contact-type[style$="display: none;"]').find('input, select').prop 'disabled', true

  # Don't allow pressing enter to submit the forms, unless you are pressing enter on a submit button
  $('.metadata-form, .umm-form').on 'keypress', ':input:not(textarea):not([type=submit])', (event) ->
    if event.keyCode == 13
      event.preventDefault()
      false

  # Necessary to prevent submission of auto-completed hidden fields.
  $('.metadata-form, .umm-form').on 'submit', (event) ->
    # Within the content forms on drafts pages...
    $('.metadata-form, .umm-form')
      # Find children tags which have display: none;, but are not eui-accordion__body and
      # have not been intentionally hidden with type='hidden'
      .find(':not("[type=\'hidden\']"):not(".eui-accordion__body")[style$="display: none;"]')
      # Find input children that have not been intentionally hidden with type='hidden'
      .find(':not("[type=\'hidden\']")input').val("")

  # check cmr validation button for collection drafts
  $('#check-cmr-validation-button').on 'click', (event) ->
    $.ajax "#{draftId}/check_cmr_validation",
      method: 'GET'
      success: (data, status, response) ->
        $modalText = $('<div/>',
          html: "<p>#{data.status_text}</p>"
        )

        $errorList = $('<ul/>')
        if data.hasOwnProperty('existing_errors')
          $existingErrors = $('<li/>',
            text: "Existing Errors: #{data.existing_errors}"
          )
          $existingErrors.appendTo($errorList)
        if data.hasOwnProperty('warnings')
          $warnings = $('<li/>',
            text: "Warnings: #{data.warnings}"
          )
          $warnings.appendTo($errorList)
        $errorList.appendTo($modalText)

        if data.hasOwnProperty('existing_errors') || data.hasOwnProperty('warnings')
          $actionText = $('<div/>',
            html: '<p>Are you sure you want to publish this draft now?</p>'
          )
          $actionText.appendTo($modalText)

        $('.check-cmr-validation-text').html($modalText)

        $('#publish-with-errors-button').removeClass('is-hidden')
        $('#check-cmr-validation-draft-modal .modal-close.eui-btn').text('No, Return to Draft Preview')

      error: (response, status, error) ->
        $modalText = $('<div/>',
          html: "<p>#{response.responseJSON.status_text}</p>"
        )

        $actionText = $('<div/>',
          html: '<p>Please use the progress indicators on the draft preview page to address the following:</p>'
        )

        $actionText.appendTo($modalText)

        $errorList = $('<ul/>', class: 'no-bullet')
        for error in response.responseJSON.errors
          $listElement = $('<li/>',
            text: error
          )
          $listElement.appendTo($errorList)
        $errorList.appendTo($modalText)



        $('.check-cmr-validation-text').html($modalText)

        $('#publish-with-errors-button').addClass('is-hidden')
        $('#check-cmr-validation-draft-modal .modal-close.eui-btn').text('Ok')
