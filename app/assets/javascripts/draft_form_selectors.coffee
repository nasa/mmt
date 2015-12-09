$(document).ready ->
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

  # Handle global spatial checkbox
  $('.spatial-coverage-type.horizontal').on 'click', 'a.global-coverage', ->
    $fields = $(this).parent().siblings('.compass-coordinates')
    $fields.find('.bounding-rectangle-point.west').val('-180')
    $fields.find('.bounding-rectangle-point.east').val('180')
    $fields.find('.bounding-rectangle-point.north').val('90')
    $fields.find('.bounding-rectangle-point.south').val('-90')
    $fields.find('.bounding-rectangle-point.south').trigger('change')

  # Handle AdditionalAttributes type select
  $('#additional-attributes').on 'change', '.additional-attribute-type-select', ->
    value = $(this).val()
    $parent = $(this).parents('.multiple-item')
    $begin = $parent.find('.parameter-range-begin')
    $end = $parent.find('.parameter-range-end')

    disabledValues = ['STRING', 'BOOLEAN']
    if disabledValues.indexOf(value) != -1
      $begin.prop 'disabled', true
      $end.prop 'disabled', true
      $begin.addClass('disabled')
      $end.addClass('disabled')
    else
      $begin.prop 'disabled', false
      $end.prop 'disabled', false
      $begin.removeClass('disabled')
      $end.removeClass('disabled')
