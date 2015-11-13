# Setup NestedItemPicker for Science Keywords
picker = undefined
@setupScienceKeywords = (data) ->
  picker = new NestedItemPicker('.nested-item-picker', data: data)

$(document).ready ->
  $('.multiple').on 'click', '.add-new', (e) ->
    simple = $(this).hasClass('new-simple')
    topMultiple = $(this).closest('.multiple')
    multipleItem = undefined
    newDiv = undefined

    multipleItem = topMultiple.children('.multiple-item:last')
    newDiv = multipleItem.clone(true)

    multipleIndex = getIndex(multipleItem)
    $(newDiv).removeClass('multiple-item-' + multipleIndex).addClass 'multiple-item-' + (multipleIndex + 1)
    if simple
      # multiple-item is a simple field with no index (just a text field)

      # clone parent and clear field
      $.each $(newDiv).find('select, input, textarea'), (index, field) ->
        $(field).val ''

      newDiv = incrementElementIndex(newDiv, multipleIndex, true)
      $(newDiv).appendTo topMultiple
    else
      # multiple-item is a collection of fields

      # Remove any extra multiple-item, should only be one per .multiple
      $.each $(newDiv).find('.multiple').not('.multiple.addresses-street-addresses'), (index, multiple) ->
        $.each $(multiple).children('.multiple-item'), (index2) ->
          if index2 > 0
            $(this).remove()

      newDiv = incrementElementIndex(newDiv, multipleIndex, false)
      $(newDiv).insertAfter multipleItem

      # close last accordion and open all new accordions
      $(multipleItem).addClass 'is-closed'
      $(newDiv).find('.accordion').removeClass 'is-closed'

      # Increment index on first accordion header, set all others to 1
      $.each $(newDiv).find('.accordion-header'), (index, field) ->
        headerHtml = $(field).html()
        headerIndex = headerHtml.match(/\d+/)
        if headerIndex != undefined
          if index == 0
            $(field).html headerHtml.replace(headerIndex, parseInt(headerIndex) + 1)
          else
            $(field).html headerHtml.replace(headerIndex, 1)

    # remove validation errors
    $(newDiv).find('.validation-error').remove()

    $(newDiv).find('select, input, textarea').removeAttr 'disabled'
    $(newDiv).find('select, input, textarea').not('input[type="hidden"]')[0].focus()

    # Remove points from preview link
    $.each $(newDiv).find('.spatial-preview-link'), ->
      url = $(this).attr('href').split('?')[0]
      $(this).attr 'href', url

    e.stopImmediatePropagation()

  incrementElementIndex = (newDiv, multipleIndex, simple) ->
    # Find the index that needs to be incremented
    firstElement = undefined
    if simple
      firstElement = $(newDiv).find('select, input, textarea').first()
    else
      firstElement = $(newDiv).find('select, input, textarea').not('.simple-multiple-field').first()

    nameIndex = $(firstElement).attr('name').lastIndexOf(multipleIndex)
    idIndex = $(firstElement).attr('id').lastIndexOf(multipleIndex)

    # Loop through newDiv and increment the correct index
    $.each $(newDiv).find('select, input, textarea, label'), (index, field) ->
      if $(field).is('input, textarea, select')
        name = $(field).attr('name')
        if name != undefined
          name = name.slice(0, nameIndex) + name.slice(nameIndex).replace(multipleIndex, multipleIndex + 1)
          $(field).attr 'name', name

        id = $(field).attr('id')
        id = id.slice(0, idIndex) + id.slice(idIndex).replace(multipleIndex, multipleIndex + 1)
        $(field).attr 'id', id

        # Clear field value
        if $(field).attr('type') == 'radio'
          $(field).prop 'checked', false
        else
          $(field).not('input[type="hidden"]').val ''

      else if $(field).is('label')
        labelFor = $(field).attr('for')

        if labelFor != undefined
          labelFor = labelFor.slice(0, idIndex) + labelFor.slice(idIndex).replace(multipleIndex, multipleIndex + 1)
          $(field).attr 'for', labelFor

    newDiv

  $('.multiple').on 'click', '.remove', ->
    multipleItem = $(this).closest('.multiple-item')
    $(multipleItem).remove()

  # Handle responsibility-picker (org/person)
  $('.responsibility-picker').change ->
    partyType = $(this).parents('.party-type')
    switch $(this).val()
      when 'organization'
        $(partyType).siblings('.organization-fields').show()
        $(partyType).siblings('.person-fields').hide()
      when 'person'
        $(partyType).siblings('.organization-fields').hide()
        $(partyType).siblings('.person-fields').show()

    # Clear all org and person fields
    $.each $(partyType).siblings('.organization-fields, .person-fields').find('input'), (index, field) ->
      $(field).val ''

    # Toggle checkboxes
    $(this).siblings('.responsibility-picker').prop 'checked', false
    $(this).prop 'checked', true

  # Handle geometry-picker (points/rectangles/polygons/lines)
  $('.geometry-picker').change ->
    geometryType = $(this).parents('.geometry-type')
    $(geometryType).siblings('.points-fields').hide()
    $(geometryType).siblings('.bounding-rectangles-fields').hide()
    $(geometryType).siblings('.g-polygons-fields').hide()
    $(geometryType).siblings('.lines-fields').hide()

    switch $(this).val()
      when 'points'
        $(geometryType).siblings('.points-fields').show()
      when 'bounding-rectangles'
        $(geometryType).siblings('.bounding-rectangles-fields').show()
      when 'g-polygons'
        $(geometryType).siblings('.g-polygons-fields').show()
      when 'lines'
        $(geometryType).siblings('.lines-fields').show()

    # Clear all fields
    $.each $(geometryType).siblings('.points-fields, .bounding-rectangles-fields, .g-polygons-fields, .lines-fields').find('input'), (index, field) ->
      $(field).val ''

    # Toggle checkboxes
    $(geometryType).find('.geometry-picker').prop 'checked', false
    $(this).prop 'checked', true

  # Handle coordinate-system-picker (geographic/local)
  $('.coordinate-system-picker').change ->
    coordinateSystemType = $(this).parents('.coordinate-system-type')
    switch $(this).val()
      when 'geographic'
        $(coordinateSystemType).siblings('.geographic-coordinate-system-fields').show()
        $(coordinateSystemType).siblings('.local-coordinate-system-fields').hide()
      when 'local'
        $(coordinateSystemType).siblings('.geographic-coordinate-system-fields').hide()
        $(coordinateSystemType).siblings('.local-coordinate-system-fields').show()

    # Clear all fields
    $.each $(coordinateSystemType).siblings('.geographic-coordinate-system-fields, .local-coordinate-system-fields').find('input'), (index, field) ->
      $(field).val ''

    # Toggle checkboxes
    $(this).siblings('.coordinate-system-picker').prop 'checked', false
    $(this).prop 'checked', true

  # Handle TemporalRangeType selector
  $('.temporal-range-type-select').change ->
    $(this).parent().siblings('.temporal-range-type').hide()
    # Clear all fields
    $(this).parent().siblings('.temporal-range-type').find('input, select').val ''
    switch $(this).val()
      when 'SingleDateTime'
        $(this).parent().siblings('.temporal-range-type.single-date-time').show()
      when 'RangeDateTime'
        $(this).parent().siblings('.temporal-range-type.range-date-time').show()
      when 'PeriodicDateTime'
        $(this).parent().siblings('.temporal-range-type.periodic-date-time').show()

  # Handle SpatialCoverageType selector
  $('.spatial-coverage-type-select').change ->
    $(this).parent().siblings('.spatial-coverage-type').hide()

    # Clear all fields
    $(this).parent().siblings('.spatial-coverage-type').find('input, select').not('input[type="radio"]').val ''

    # Clear radio buttons
    $(this).parent().siblings('.spatial-coverage-type').find('input[type="radio"]').prop 'checked', false

    switch $(this).val()
      when 'HORIZONTAL'
        $(this).parent().siblings('.spatial-coverage-type.horizontal').show()
      when 'VERTICAL'
        $(this).parent().siblings('.spatial-coverage-type.vertical').show()
      when 'ORBITAL'
        $(this).parent().siblings('.spatial-coverage-type.orbit').show()
      when 'BOTH'
        $(this).parent().siblings('.spatial-coverage-type.horizontal').show()
        $(this).parent().siblings('.spatial-coverage-type.vertical').show()

  getIndex = (multipleItem) ->
    classMatch = $(multipleItem).attr('class').match(/multiple-item-(\d+)/)
    if classMatch == null
      false
    else
      parseInt classMatch[1]

  # Search form
  $('#search').on 'click', 'button', ->
    # Set search_type to whichever button was pressed
    name = $(this).attr('name')
    form = $(this).parents('form')
    $(form).find('#search_type').val name
    form.submit()

  $('#search input').keypress (event) ->
    # Set search_type to whichever form the user pressed enter in
    if event.which == 13
      name = 'full_search'
      if $(this).parent('.quick-search').length > 0
        name = 'quick_find'
      form = $(this).parents('form')
      $(form).find('#search_type').val name
      form.submit()

  # Shape file uploads
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
      hasPoints = undefined
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

  $('.latitude, .longitude').on 'change', ->
    latitude = undefined
    longitude = undefined
    coordinates = []
    previewLink = $(this).parents('.accordion-body').find('.spatial-preview-link')
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
    west = undefined
    south = undefined
    east = undefined
    north = undefined
    coordinates = []
    previewLink = $(this).parents('.accordion-body').find('.spatial-preview-link')
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

  # Handle add keyword button
  $('.add-science-keyword').on 'click', ->
    addKeyword 'science'
  $('.add-spatial-keyword').on 'click', ->
    addKeyword 'spatial'

  addKeyword = (type) ->
    # Add selected value to keyword list
    values = picker.getValues()
    keywordList = $('.selected-' + type + '-keywords ul')
    li = undefined
    $.each values, (index, value) ->
      li = $('<li>' + value + '<a class=\'remove\'><i class=\'fa fa-times-circle\'></i></a></li>')
      $('<input/>',
        type: 'hidden'
        name: 'draft[' + type + '_keywords][]'
        id: 'draft_' + type + '_keywords_'
        value: value).appendTo li
      $(li).appendTo keywordList

    # Reset picker to top level
    picker.resetPicker()

  $('.selected-science-keywords, .selected-spatial-keywords').on 'click', '.remove', ->
    $(this).parent().remove()

  $('input[type="datetime"]').focus ->
    pickerOpts =
      startView: 2
      format: 'yyyy-mm-dd'
      todayBtn: 'linked'
      clearBtn: true
      autoclose: true
      todayHighlight: true
      forceParse: false
      keyboardNavigation: false
    $(this).datepicker(pickerOpts)
    $(this).datepicker('show')
    .on 'changeDate', ->
      $(document).trigger 'mmtValidate'
    .on 'hide', ->
      $(this).datepicker('remove')

$.extend $.fn.datepicker.DPGlobal,
  formatDate: (date, format, language) ->
    if !date
      return ''

    if format == 'yyyy-mm-dd'
      # Display the correct format with time in the input field
      date.toISOString()
    else if format == 'MM yyyy'
      # Display 'November 2015' when viewing the month instead of the ISOString
      dates = $.fn.datepicker.dates
      "#{dates[language].months[date.getUTCMonth()]} #{date.getUTCFullYear()}"
