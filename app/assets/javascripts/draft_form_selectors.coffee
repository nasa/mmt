$(document).ready ->
  if $('.metadata-form').length > 0

    # Handle geometry-picker (points/rectangles/polygons/lines)
    $('.geometry-picker').change ->
      $('.geometry-type').show()
      geometryType = $(this).parents('.geometry-type-group')
      $('.geometry-type .points-fields').hide()
      $('.geometry-type .bounding-rectangles-fields').hide()
      $('.geometry-type .g-polygons-fields').hide()
      $('.geometry-type .lines-fields').hide()

      switch $(this).val()
        when 'points'
          $('.geometry-type .points-fields').show()
        when 'bounding-rectangles'
          $('.geometry-type .bounding-rectangles-fields').show()
        when 'g-polygons'
          $('.geometry-type .g-polygons-fields').show()
        when 'lines'
          $('.geometry-type .lines-fields').show()

      # Clear all fields
      $.each $('.geometry-type').find('.points-fields, .bounding-rectangles-fields, .g-polygons-fields, .lines-fields').find('input'), (index, field) ->
        $(field).val ''

      # Toggle checkboxes
      $('.geometry-picker').prop 'checked', false
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
      $parent = $(this).parents('.temporal-range-type-group')
      $parent.siblings('.temporal-range-type').hide()
      # Clear all fields
      $parent.siblings('.temporal-range-type').find('input, select').val ''
      switch $(this).val()
        when 'SingleDateTime'
          $parent.siblings('.temporal-range-type.single-date-time').show()
        when 'RangeDateTime'
          $parent.siblings('.temporal-range-type.range-date-time').show()
        when 'PeriodicDateTime'
          $parent.siblings('.temporal-range-type.periodic-date-time').show()

    # Handle SpatialCoverageType selector
    $('.spatial-coverage-type-select').change ->
      $parent = $(this).parents('.spatial-coverage-type-group')

      $parent.siblings('.spatial-coverage-type').hide()

      # Clear all fields
      $parent.siblings('.spatial-coverage-type').find('input, select').not('input[type="radio"]').val ''

      # Clear radio buttons
      $parent.siblings('.spatial-coverage-type').find('input[type="radio"]').prop 'checked', false

      # Hide geographic and local coordinate system fields
      $parent.siblings().find('.geographic-coordinate-system-fields').hide()
      $parent.siblings().find('.local-coordinate-system-fields').hide()

      switch $(this).val()
        when 'HORIZONTAL'
          $parent.siblings('.spatial-coverage-type.horizontal').show()
        when 'VERTICAL'
          $parent.siblings('.spatial-coverage-type.vertical').show()
        when 'ORBITAL'
          $parent.siblings('.spatial-coverage-type.orbit').show()
        when 'BOTH'
          $parent.siblings('.spatial-coverage-type.horizontal').show()
          $parent.siblings('.spatial-coverage-type.vertical').show()

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

    # Handle Data Contacts Type selector
    $('.data-contact-type-select').change ->
      $contactTypeSelect = $(this).parents('.data-contact-type-select-parent')
      $dataContactTypes = $contactTypeSelect.siblings('.data-contact-type')
      # hide all the form elements
      $dataContactTypes.hide()
      # clear fieldset
      $dataContactTypes.find('input, select').val ''
      # disable form elements so blank values dont interfere with saving
      $dataContactTypes.find('input, select').prop 'disabled', true

      switch $(this).val()
        # show and enable selected data contact type
        when 'DataCenterContactPerson'
          $contactTypeSelect.siblings('.data-contact-type.data-center-contact-person').show()
          $contactTypeSelect.siblings('.data-contact-type.data-center-contact-person').find('input, select').prop 'disabled', false
        when 'DataCenterContactGroup'
          $contactTypeSelect.siblings('.data-contact-type.data-center-contact-group').show()
          $contactTypeSelect.siblings('.data-contact-type.data-center-contact-group').find('input, select').prop 'disabled', false
        when 'NonDataCenterContactPerson'
          $contactTypeSelect.siblings('.data-contact-type.non-data-center-contact-person').show()
          $contactTypeSelect.siblings('.data-contact-type.non-data-center-contact-person').find('input, select').prop 'disabled', false
        when 'NonDataCenterContactGroup'
          $contactTypeSelect.siblings('.data-contact-type.non-data-center-contact-group').show()
          $contactTypeSelect.siblings('.data-contact-type.non-data-center-contact-group').find('input, select').prop 'disabled', false

    # Clear radio button selection and hide content
    $('.clear-radio-button').on 'click', ->
      $fieldset = $(this).parents('fieldset')
      content = $(this).data('content')

      $(this).siblings().find('input, select, textarea').not('input[type="radio"]').val ''
      $fieldset.find(".#{content}-group input[type='radio']").prop 'checked', false
      $fieldset.find(".#{content} input[type='radio']").prop 'checked', false

      $fieldset.find(".#{content} .geometry-type").hide()

      $fieldset.find(".#{content}").hide()
