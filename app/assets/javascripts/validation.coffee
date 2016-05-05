$(document).ready ->

  getPageJson = ->
    json = JSON.parse($('.metadata-form').find('input, textarea, select').filter ->
      return this.value
    .serializeJSON()).Draft

    fixNumbers(json)
    fixIntegers(json)
    removeNulls(json)

    return json if json?
    return {}

  removeNulls = (obj) ->
    isArray = obj instanceof Array
    for k of obj
      if obj[k] == null
        if isArray then obj.splice(k, 1) else delete obj[k]
      else if typeof obj[k] == 'object'
        removeNulls obj[k]
    return

  fixNumbers = (json) ->
    numberFields = $('.mmt-number.validate').filter ->
      this.value

    for element in numberFields
      name = $(element).attr('name')
      re = /\[(.*?)\]/g
      path = []
      value = json
      while match = re.exec name
        newPath = humps.pascalize(match[1])
        value = value[newPath]
        path.push newPath

      if $.isNumeric(value)
        updateJson(json, path, parseFloat(value))

    return

  fixIntegers = (json) ->
    integerFields = $('.mmt-integer.validate').filter ->
      this.value

    for element in integerFields
      name = $(element).attr('name')
      re = /\[(.*?)\]/g
      path = []
      value = json
      while match = re.exec name
        newPath = humps.pascalize(match[1])
        value = value[newPath]
        path.push newPath

      if $.isNumeric(value) and Math.floor(value) == +value
        updateJson(json, path, parseInt(value))

    return

  updateJson = (json, path, value) ->
    tempJson = json
    index = 0
    while index < path.length - 1
      tempJson = tempJson[path[index]]
      index++

    tempJson[path[path.length - 1]] = value
    return

  validationMessages = (error) ->
    keyword = error.keyword
    if error.title.length > 0
      field =  error.title
    else
      path = error.dataPath.split('/')
      field = path[path.length - 1]
      field = path[path.length - 2] if $.isNumeric(field)
    type = getFieldType(error.element)

    switch keyword
      when 'required' then "#{field} is required"
      when 'maxLength' then "#{field} is too long"
      when 'minLength' then "#{field} is too short"
      when 'pattern' then "#{field} must match the provided pattern"
      when 'format'
        if type == 'URI'
          "#{field} is an invalid URI"
        else
          "#{field} is an incorrect format"
      when 'minItems' then "#{field} has too few items"
      when 'maxItems' then "#{field} has too many items"
      when 'type' then "#{field} must be of type #{type}"
      when 'maximum' then "#{field} is too high"
      when 'minimum' then "#{field} is too low"
      when 'parameter-range-later' then "#{field} must be later than Parameter Range Begin"
      when 'parameter-range-larger' then "#{field} must be larger than Parameter Range Begin"
      when 'oneOf'
        # oneOf Party means it wants oneOf OrganizationName or Person
        # Those errors don't matter to a user because they don't see
        # that difference in the forms
        if field == 'Party'
          "Party is incomplete"
        else
          "#{field} should have one type completed"
      when 'invalidPicklist' then "#{field} #{error.message}"

  getFieldType = (element) ->
    classes = $(element).attr('class').split(/\s+/)
    if classes.indexOf('mmt-number') != -1
      type = 'number'
    if classes.indexOf('mmt-integer') != -1
      type = 'integer'
    if classes.indexOf('mmt-boolean') != -1
      type = 'boolean'
    if classes.indexOf('mmt-date-time') != -1
      type = 'date-time'
    if classes.indexOf('mmt-uri') != -1
      type = 'URI'
    if classes.indexOf('mmt-uuid') != -1
      type = 'uuid'
    type

  displayInlineErrors = (errors) ->
    for error in errors
      $element = $("##{error.id}")

      message = '<i class="fa fa-exclamation-triangle"></i>'
      message += validationMessages(error)

      classes = 'eui-banner--danger validation-error'

      errorElement = $('<div/>',
        id: "#{error.id}_error"
        class: classes
        html: message
      )

      # if the error needs to be shown after the remove button
      if $element.parent().hasClass('multiple-item')
        afterElement = $element.parent().children('.remove')
      else
        afterElement = $element

      # if the error needs to be shown after the help icon
      if $element.next().hasClass('display-modal')
        afterElement = $element.next()

      # if the error needs to be shown after the select2
      if $element.next().hasClass('select2-container')
        afterElement = $element.next()

      $(errorElement).insertAfter(afterElement)

  displaySummary = (errors) ->
    summary = $('<div/>',
      class: 'eui-banner--danger summary-errors'
      html: '<i class="fa fa-exclamation-triangle"></i> This draft has the following errors:'
    )

    errorList = $('<ul/>', class: 'no-bullet')
    for error in errors
      message = validationMessages(error)
      listElement = $('<li/>')
      $('<a/>',
        href: "##{error.id}"
        text: message
      ).appendTo(listElement)
      $(listElement).appendTo(errorList)

    $(errorList).appendTo(summary)

    $(summary).insertAfter('.nav-top')

  getErrorDetails = (error) ->
    if error.keyword == 'additionalProperties'
      error = null
      return

    error.dataPath += "/#{error.params.missingProperty}" if error.params.missingProperty?

    path = for p in error.dataPath.replace(/^\//, '').split('/')
      humps.decamelize(p)
    path = path.join('_')

    # Fix the path for special case keys
    path = path.replace('u_r_ls', 'urls')
    path = path.replace('d_o_i', 'doi')
    path = path.replace('i_s_b_n', 'isbn')
    path = path.replace('i_s_o_topic_categories', 'iso_topic_categories')
    error.path = path

    id = "draft_#{path}"
    error.id = id
    error.element = $("##{id}")
    labelFor = id.replace(/\d+$/, "")
    error.title = $("label[for='#{labelFor}']").text()
    error

  validateParameterRanges = (errors) ->
    if $('#additional-attributes').length > 0
      $('.multiple.additional-attributes > .multiple-item').each (index, element) ->
        type = $(element).find('.additional-attribute-type-select').val()
        if type.length > 0
          $begin = $(element).find('.parameter-range-begin')
          $end = $(element).find('.parameter-range-end')
          beginValue = $begin.val()
          endValue = $end.val()

          if beginValue.length > 0 && endValue.length > 0 && beginValue >= endValue
            largerTypes = ['INT', 'FLOAT']
            keyword = 'parameter-range-later'
            keyword = 'parameter-range-larger' if largerTypes.indexOf(type) != -1
            newError =
              keyword: keyword,
              dataPath: "/AdditionalAttributes/#{index}/ParameterRangeEnd"
              params: {}
            errors.push newError

  validatePicklistValues = (errors) ->
    $('select > option:disabled:selected').each ->
      id = $(this).parent().attr('id')
      visitedFields.push id

      dataPath = switch
        when /processing_level_id/.test id
          '/ProcessingLevel/Id'
        when /metadata_language/.test id
          '/MetadataLanguage'
        when /data_language/.test id
          '/DataLanguage'
        when /related_urls_\d*_mime_type/.test id
          [_, index] = id.match /related_urls_(\d*)_mime_type/
          "/RelatedUrls/#{index}/MimeType"
        when /draft_platforms_\d*_type/.test id
          [_, index] = id.match /platforms_(\d*)_type/
          "/Platforms/#{index}/Type"
        when /organizations_\d*_party_organization_name_short_name/.test id
          [_, index] = id.match /organizations_(\d*)_party_organization_name_short_name/
          "/Organizations/#{index}/Party/OrganizationName/ShortName"
        # FileSize/Unit (RelatedUrls and Distributions)
        # Address/Country (Organizations and Personnel)
          # State/Province

      errors = errors.filter (err) ->
        # console.log "err: #{JSON.stringify(err)}"
        if err.keyword == 'required'
          dataPath.indexOf(err.dataPath) == -1
        else
          true

      error = {}
      error.keyword = 'invalidPicklist'
      error.message = "value [#{$(this).val()}] does not match a valid selection option"
      error.params = {}
      error.dataPath = dataPath
      errors.push error

    errors

  validatePage = (opts) ->
    $('.validation-error').remove()
    $('.summary-errors').remove()
    json = getPageJson()

    ajv = Ajv
      allErrors: true,
      jsonPointers: true,
      formats: 'uri' : URI_REGEX
    validate = ajv.compile(globalJsonSchema)
    validate(json)
    errors = validate.errors

    validateParameterRanges(errors)
    errors = validatePicklistValues(errors)

    inlineErrors = []
    summaryErrors = []

    # Display errors, from visited fields
    for error, index in errors
      if error = getErrorDetails error

        # does the error id match the visitedFields
        visited = visitedFields.filter (e) ->
          return e == error.id
        .length > 0

        if (visited or opts.showConfirm) and inlineErrors.indexOf(error) == -1
          # don't duplicate errors
          inlineErrors.push error if $("##{error.id}").length > 0
          summaryErrors.push error if $("##{error.id}").length > 0

    if inlineErrors.length > 0 and opts.showInline
      displayInlineErrors inlineErrors
    if summaryErrors.length > 0 and opts.showSummary
      displaySummary summaryErrors
    if opts.showConfirm
      # 'visit' any invalid fields so they don't forget about their error
      for error in inlineErrors
        visitedFields.push error.id unless visitedFields.indexOf(error.id) != -1

    valid = summaryErrors.length == 0

    if !valid and opts.showConfirm
      # click on link to open modal
      $('#display-invalid-draft-modal').click()
      return false

    valid

  visitedFields = []

  # Validate the whole page on page load
  if $('.metadata-form').length > 0
    # "visit" each field with a value on page load
    $('.validate').filter ->
      return switch this.type
        when 'radio'
          # don't want to save fields that aren't translated into metadata
          this.name? and this.checked
        else
          this.value
    .each (index, element) ->
      visitedFields.push $(element).attr('id')

    validatePage
      showInline: true
      showSummary: true
      showConfirm: false

  # // set up validation call
  $('.metadata-form').on 'blur', '.validate', ->
    id = $(this).attr('id')
    visitedFields.push id unless visitedFields.indexOf(id) != -1
    # if the field is a datepicker, and the datepicker is still open, don't validate yet
    return if $(this).attr('type') == 'datetime' and $('.datepicker:visible').length > 0
    validateFromFormChange()

  # 'blur' functionality for select2 fields
  $('.select2-select').on 'select2:open', (event) ->
    id = $(this).attr('id')
    visitedFields.push id unless visitedFields.indexOf(id) != -1

  $('.metadata-form').on 'click', '.remove', ->
    validateFromFormChange()

  $('.metadata-form').on 'change', 'input[type="radio"], select', ->
    validateFromFormChange()

  $(document).on 'mmtValidate', ->
    validateFromFormChange()

  validateFromFormChange = ->
    validatePage
      showInline: true
      showSummary: true
      showConfirm: false

  $('.next-section').on 'change', ->
    $('#new_form_name').val(this.value)

    if validatePage
      showInline: true
      showSummary: true
      showConfirm: true

      $('.metadata-form').submit()

  $('.save-form').on 'click', (e) ->
    $('#commit').val($(this).val())

    return validatePage
      showInline: true
      showSummary: true
      showConfirm: true

  # Handle modal 'Yes', submit form
  $('#invalid-draft-accept').on 'click', ->
    $('.metadata-form').submit()

  URI_REGEX = /^(?:[A-Za-z][A-Za-z0-9+\-.]*:(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?|(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?)$/
