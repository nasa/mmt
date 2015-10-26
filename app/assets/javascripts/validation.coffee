$(document).ready ->

  getPageJson = ->
    json = JSON.parse($('.metadata-form').find('input, textarea, select').filter ->
      return this.value
    .serializeJSON()).Draft
    console.log json

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
      when 'format' then "#{field} must match the provided pattern"
      when 'minItems' then "#{field} has too few items"
      when 'maxItems' then "#{field} has too many items"
      when 'type' then "#{field} must be of type #{type}"
      when 'maximum' then "#{field} is too high"
      when 'minimum' then "#{field} is too low"

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

      # Remove old error
      $("#{error.id}_error").remove()

      message = '<i class="fa fa-exclamation-triangle"></i>'
      message += validationMessages(error)

      classes = 'banner banner-danger validation-error'
      classes += ' half-width' if $element.hasClass('half-width')

      errorElement = $('<div/>',
        id: "#{error.id}_error"
        class: classes
        html: message
      ).insertAfter($element)

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
    path = for p in error.path.split('.')
      humps.decamelize(p)
    id = "draft_#{path.join('_')}"
    error.id = id
    error.element = $("##{id}")
    labelFor = id.replace(/\d+$/, "")
    error.title = $("label[for='#{labelFor}']").text()
    error

  validatePage = (opts) ->
    console.log 'Doing validation'
    if opts.element?
      # delete just this element's error
      id = "##{$(opts.element).attr('id')}_error"
      $(id).remove()
    else
      # delete all inline errors
    $('.validation-error').remove()
    $('.summary-errors').remove()
    json = getPageJson()
    validate = jsen(globalJsonSchema, {greedy: true})
    validate(json)
    errors = validate.errors

    if opts.pageLoad?
      formErrors.push(error) for error in errors

    newErrors = getNewErrors(formErrors, errors)
    console.log "New Errors: #{JSON.stringify(newErrors)}"

    inlineErrors = []
    summaryErrors = []
    formErrors.length = 0
    formErrors.push(error) for error in errors

    # Display any new errors created by a form change
    for error, index in newErrors
      error = getErrorDetails error

      unless opts.element? and $(opts.element).attr('id') == error.id
        inlineErrors.push error if $("##{error.id}").length > 0
        summaryErrors.push error if $("##{error.id}").length > 0

    # Display any regular errors
    for error, index in errors
      error = getErrorDetails error

      if visitedFields.indexOf(error.id) != -1
        # if opts.element? and $(opts.element).attr('id') == error.id
        #   inlineErrors.push error
        # else unless opts.element?
        if inlineErrors.indexOf(error) == -1 # don't duplicate errors
          inlineErrors.push error if $("##{error.id}").length > 0
          summaryErrors.push error if $("##{error.id}").length > 0

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
    validatePage
      pageLoad: true
      showInline: true
      showSummary: true
      showConfirm: false

  # // set up validation call
  $('.metadata-form').on 'blur', '.validate', ->
    id = $(this).attr('id')
    visitedFields.push id unless visitedFields.indexOf(id) != -1

    validatePage
      element: this
      showInline: true
      showSummary: true
      showConfirm: false

  $('.metadata-form').on 'click', '.remove', ->
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



# TODO minItems doesn't show because of visitedFields check
