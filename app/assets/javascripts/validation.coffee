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
      path = error.path.split('.')
      field = path[path.length - 1]
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
      when 'oneOf'
        field = path[path.length - 2]
        "#{field} should have one type completed"

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

      classes = 'banner banner-danger validation-error'
      classes += ' half-width' if $element.hasClass('half-width')

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

      # if the error needs to be shows after the help icon
      if $element.next().hasClass('display-modal')
        afterElement = $element.next()

      $(errorElement).insertAfter(afterElement)

  displaySummary = (errors) ->
    summary = $('<div/>',
      class: 'banner banner-danger summary-errors'
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

  getNewErrors = (newErrors, oldErrors) ->
    oldErrors.filter (currentOld) ->
      newErrors.filter (currentNew) ->
        currentNew.path == currentOld.path
      .length == 0

  getErrorDetails = (error) ->
    if error.keyword == 'additionalProperties'
      error = null
      return
    path = for p in error.path.split('.')
      humps.decamelize(p)
    path = path.join('_')

    # Fix the path for special case keys
    path = path.replace('u_r_ls', 'urls')
    path = path.replace('d_o_i', 'doi')
    path = path.replace('i_s_b_n', 'isbn')
    path = path.replace('i_s_o_topic_categories', 'iso_topic_categories')

    id = "draft_#{path}"
    error.id = id
    error.element = $("##{id}")
    labelFor = id.replace(/\d+$/, "")
    error.title = $("label[for='#{labelFor}']").text()
    error

  validatePage = (opts) ->
    $('.validation-error').remove()
    $('.summary-errors').remove()
    json = getPageJson()
    validate = jsen(globalJsonSchema, {greedy: true})
    validate(json)
    errors = validate.errors

    if opts.pageLoad?
      formErrors.push(error) for error in errors

    newErrors = getNewErrors(formErrors, errors)

    inlineErrors = []
    summaryErrors = []
    formErrors.length = 0
    formErrors.push(error) for error in errors

    # Display any new errors created by a form change
    for error, index in newErrors
      if error = getErrorDetails error

        unless opts.element? and $(opts.element).attr('id') == error.id
          # 'visit' the new error field
          visitedFields.push error.id unless visitedFields.indexOf(error.id) != -1

          inlineErrors.push error if $("##{error.id}:visible").length > 0
          summaryErrors.push error if $("##{error.id}:visible").length > 0

    # Display 'old' errors, from visited fields
    for error, index in errors
      if error = getErrorDetails error

        # does the error id match the visitedFields
        visited = visitedFields.filter (e) ->
          return e.match(error.id)
        .length > 0

        if (visited or opts.showConfirm) and inlineErrors.indexOf(error) == -1 # don't duplicate errors
          inlineErrors.push error if $("##{error.id}:visible").length > 0
          summaryErrors.push error if $("##{error.id}:visible").length > 0

    displayInlineErrors inlineErrors if inlineErrors.length > 0 and opts.showInline
    displaySummary summaryErrors if summaryErrors.length > 0 and opts.showSummary

    valid = summaryErrors.length == 0

    if !valid and opts.showConfirm
      return confirm 'This page has invalid data. Are you sure you want to save it and proceed?'

    valid

  visitedFields = []
  formErrors = []

  # Validate the whole page on page load
  if $('.metadata-form').length > 0
    # "visit" each field with a value on page load
    $('.validate').filter ->
      return this.value
    .each (index, element) ->
      visitedFields.push $(element).attr('id')

    validatePage
      pageLoad: true
      showInline: true
      showSummary: true
      showConfirm: false

  # // set up validation call
  $('.metadata-form').on 'blur', '.validate', ->
    id = $(this).attr('id')
    visitedFields.push id unless visitedFields.indexOf(id) != -1
    validateFromFormChange()

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
    if validatePage
      showInline: true
      showSummary: true
      showConfirm: true

      $('#new_form_name').val(this.value)
      this.form.submit()

  $('.save-form').on 'click', (e) ->
    return validatePage
      showInline: true
      showSummary: true
      showConfirm: true
