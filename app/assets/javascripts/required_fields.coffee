# Show conditionally required fields' required icons only when they are actually required.


# Make arrays of objects searchable
# https://coffeescript-cookbook.github.io/chapters/arrays/where-for-arrays-of-objects
Array::where = (query) ->
  return [] if typeof query isnt "object"
  hit = Object.keys(query).length
  @filter (item) ->
    match = 0
    for key, val of query
      match += 1 if item[key] is val
    if match is hit then true else false
# Removing Duplicate Elements from Arrays
# https://coffeescript-cookbook.github.io/chapters/arrays/removing-duplicate-elements-from-arrays
Array::unique = ->
  output = {}
  output[@[key]] = @[key] for key in [0...@length]
  value for key, value of output


$(document).ready ->
  # Stores the pages required fields
  requiredDataLevels = []

  $('.metadata-form').on 'blur', 'input, select, textarea', ->
    return if $(this).attr('type') == 'submit'

    # get current fields data-level value
    dataLevels = $(this).data('level').split('_')

    isRequired = false
    topDataLevel = dataLevels.join('_')

    # fields at the current level
    $fields = $("[data-level='#{topDataLevel}']")
    if $fields.length > 0
      values = $fields.filter ->
        this.value

      # If any of the fields have values
      if values.length > 0
        # add required icon to required fields at this level
        isRequired = true
        addRequiredFields($fields)

    # for all the other data levels
    # (some real and some that aren't)
    # draft_personnel_0_related_urls_0_ is good,
    # draft_personnel_0_related isn't an actual data level
    for level, index in dataLevels
      dataLevel = dataLevels.slice(0, index + 1).join('_')

      # if the last item in the data level is a number, we need to add a '_' to work
      [..., last] = dataLevel.split('_')
      if $.isNumeric(last)
        dataLevel += '_'

      # setup a data level object to save, or remove
      dataLevelObj = {}
      dataLevelObj.level = dataLevel
      dataLevelObj.topLevel = topDataLevel

      # if the top data level is required
      if isRequired
        # if the dataLevelObj is not already saved, save it
        if requiredDataLevels.where(dataLevelObj).length == 0
          requiredDataLevels.push(dataLevelObj)
      else
        # if the top data level is not required
        # if the dataLevelObj is found in requiredDataLevels, remove it
        for removeLevel, index in requiredDataLevels by -1
          if removeLevel.topLevel == topDataLevel
            requiredDataLevels.splice(index, 1)

    # console.log "requiredDataLevelsSize: #{requiredDataLevels.length}"
    # console.log "requiredDataLevels: #{JSON.stringify(requiredDataLevels)}"

    # Get unique required data levels
    levels = requiredDataLevels.map (obj) ->
      obj.level
    .unique()

    # Remove all required icons
    $('label.icon-required').not('label.always-required').removeClass('icon-required')

    # Add required icons to required fields within required data levels
    for dataLevel in levels
      $fields = $("[data-level='#{dataLevel}']")
      if $fields.length > 0
        addRequiredFields($fields)
      addRequiredLabels(dataLevel)

  # add icon-required to labels of required fields
  addRequiredFields = (fields) ->
    requiredLabels = []
    $(fields).each (index, field) ->
      label = getLabels(field)
      if label.hasClass('required')
        requiredLabels.push(label[0])

    $(requiredLabels).addClass('icon-required')

  # add icon-required to labels matching the level
  addRequiredLabels = (level) ->
    label = $("label##{level}")
    if label.hasClass('required')
      label.addClass('icon-required')

  # find all labels associated with given fields
  getLabels = (fields) ->
    labels = []
    $(fields).each (index, element) ->
      id = $(element).attr('id')
      # if id ends in a number, trim that number
      [..., last] = id.split('_')
      if $.isNumeric(last)
        index = id.lastIndexOf(last)
        id = id.slice(0, index)
      label = $("label[for='#{id}']")
      labels.push(label[0]) if label.length > 0

    $(labels)
