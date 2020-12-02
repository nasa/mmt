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
  if $('.metadata-form, .umm-form').length > 0
    # Set top level required fields data level
    if $('.umm-form.service-form').length > 0
      topRequiredDataLevel = 'service_draft_draft_'
    else if $('.umm-form.variable-form').length > 0
      topRequiredDataLevel = 'variable_draft_draft_'
    else if $('.umm-form.tool-form').length > 0
      topRequiredDataLevel = 'tool_draft_draft_'
    else if $('.metadata-form').length > 0
      topRequiredDataLevel = 'draft_'

    requiredFieldDataLevels = []
    for fieldName in globalJsonSchema.required
      name = humps.decamelize(fieldName)
      name = name.replace(/u_r_l/g, 'url')

      requiredFieldDataLevels.push topRequiredDataLevel + name + '_'
      requiredFieldDataLevels.push topRequiredDataLevel + name + '_0_'


  # Stores the page's required fields
  requiredDataLevels = []

  # Add required icons
  addRequiredIcons = (field) ->
    # get current fields data-level value
    return unless $(field).data('level')?

    dataLevels = $(field).data('level').split('_')
    fieldParamName = $(field).attr('name')
    if fieldParamName?
      nameLevels = fieldParamName.replace(/\]/g, '').split('[')
    else
      # some of our form pickers have no `name` as they are not actual objects
      # in the schema i.e. geometry, horizontal data resolution
      nameLevels = []

    # use data-required-level for data contacts form
    if $(field).data('required-level')? && $(field).data('required-level') != null
      # console.log 'got data-required-level. going into new RequiredIcons function'
      addRequiredIconsWithRequiredLevel(field)
      return

    # console.log 'going past data-required-level. staying in addRequiredIcons'

    isRequired = false
    currentDataLevel = dataLevels.join('_') # this is the current data-level

    # fields at the current data-level
    $fields = $("[data-level='#{currentDataLevel}']")
    if $fields.length > 0
      # get any values from the fields at the current data-level
      fieldsWithValues = $fields.filter ->
        # TODO: I wanted to change this filtering to use jQuery to be more
        # consistent with what we use everywhere else. That proved problematic
        # for our Service Organization tests (service_organizations_form_nav_spec)
        # we should revisit this with UMM-S upgrade to v1.3, MMT-2237
        if this.type == 'radio' || this.type == 'checkbox'
          this.checked
        else
          this.value

      # If the current data-level is the same as the topRequiredDataLevel (this appears to be critical to how variable/service drafts get required icons)
      # or if the current data-level is a top level required field
      # or if any of the fields have values
      if currentDataLevel == topRequiredDataLevel or requiredFieldDataLevels.indexOf(currentDataLevel) != -1 or fieldsWithValues.length > 0
        isRequired = true # add required icon to required fields at this data-level

    # for all the other data levels
    # (some real and some that aren't)
    # draft_personnel_0_related_urls_0_ is good,
    # draft_personnel_0_related isn't an actual data level
    # reconstruct the dataLevel, using the levels/words in nameLevels
    for level, index in nameLevels
      dataLevel = nameLevels.slice(0, index + 1).join('_') + '_'

      # using the nameLevels can get more specific than the data-level, which we don't want
      break if currentDataLevel.indexOf(dataLevel) == -1

      # setup a data level object to save, or remove
      dataLevelObj = {}
      dataLevelObj.level = dataLevel
      dataLevelObj.topLevel = currentDataLevel

      if isRequired
        # the current data-level is required
        # if the dataLevelObj is not already saved, save it
        if requiredDataLevels.where(dataLevelObj).length == 0
          requiredDataLevels.push(dataLevelObj)
      else
        # the current data-level is not required
        # if the dataLevelObj is found in requiredDataLevels, remove it
        for removeLevel, index in requiredDataLevels by -1
          if removeLevel.topLevel == currentDataLevel
            requiredDataLevels.splice(index, 1)

      for removeLevel, index in requiredDataLevels by -1
        $input_fields = $("[data-level='#{removeLevel.topLevel}']")
        if $input_fields.length > 0
          inputFieldsWithValues = $input_fields.filter ->
            if this.type == 'radio' || this.type == 'checkbox' then this.checked else this.value

          requiredDataLevels.splice(index, 1) if inputFieldsWithValues.length == 0


    # Get unique required data levels
    levels = requiredDataLevels.map (obj) ->
      obj.level
    .unique()

    # Remove all required icons
    $('label.eui-required-o').not('label.always-required').removeClass('eui-required-o')
    $('label.eui-required-grey-o').removeClass('eui-required-grey-o')

    # console.log "adding required icons/fields in these data-levels", levels
    # Add required icons to required fields within required data levels
    for dataLevel in levels
      $fields = $("[data-level='#{dataLevel}']")
      if $fields.length > 0
        addRequiredFields($fields)
        addOptionallyRequiredFields($fields)
      addRequiredLabels(dataLevel)

  # add class `eui-required-o` to labels of required fields (have the class `required`)
  addRequiredFields = (fields) ->
    # console.log "adding required icons to these fields", fields
    requiredLabels = []
    $(fields).each (index, field) ->
      $label = getLabels(field)
      if $label.hasClass('required')
        requiredLabels.push($label[0])

    # console.log "requiredLabels", requiredLabels
    # console.log "$(requiredLabels)", $(requiredLabels)
    $(requiredLabels).addClass('eui-required-o')

  # add eui-required-o to labels matching the level
  addRequiredLabels = (level) ->
    # console.log "adding required icon to labels at this level that hasClass required", level
    label = $("label[for=#{level}]")
    if label.hasClass('required')
      label.addClass('eui-required-o')

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
      # if element is a radio button, we want to add the icon to the label
      # for the group of radio buttons
      # this was added for UMM-S v1.3.4, but should be evaluated for other types
      if $(element).is(':radio')
        $radioParent = $(element).closest('.radio-group-parent')
        label = $radioParent.siblings('label.radio-group-label')

      labels.push(label[0]) if label.length > 0

    $(labels)

  addOptionallyRequiredFields = (fieldsAtDataLevel) ->
    # optionally required fieldsets should all be at the same data-level
    # filter fieldsAtDataLevel for optionally required fields
    $optionallyRequiredFields = $(fieldsAtDataLevel).filter ->
      $(this).hasClass('optionally-required')

    return unless $optionallyRequiredFields.length > 0

    # push all fields into optionallyRequiredLabels
    allOptionallyRequiredLabels = getLabels($optionallyRequiredFields)
    requiredLabels = []

    # filter optionally required fields for those that have a value
    $optionallyRequiredWithValueFields = $optionallyRequiredFields.filter ->
      this.value
      # we are not checking for radio buttons or checkboxes, as there are no
      # such optionally required fields yet

    $optionallyRequiredWithValueFields.each (index, element) ->
      id = $(element).attr('id')
      $label = $("label[for='#{id}']")

      # optionally required fields that have a value or are in a group that has
      # a value should be shown as required
      if $(element).hasClass('optionally-required-group')
        # get the fields in the same data-required-group (which will include the current element)
        requiredGroup = $(element).data('required-group')
        $parent = $(element).closest('.optionally-required-parent')
        $requiredGroupFields = $parent.find("input[data-required-group='#{requiredGroup}']")

        # get the labels for these fields and merge them into the list
        $requiredGroupLabels = getLabels($requiredGroupFields)
        Array::push.apply requiredLabels, $requiredGroupLabels
      else
        # not in a group, so just add the label to the list
        requiredLabels.push($label[0])

    requiredLabels.unique()

    optionallyRequiredLabels = []
    $(allOptionallyRequiredLabels).each (index, element) ->
      # we need to separate optionally required fields without values from those
      # that have values so should be shown as required
      $optionalLabel = $(element)
      isDup = false
      $(requiredLabels).each (index, element) ->
        $requiredLabel = $(element)
        isDup = true if $optionalLabel[0] == $requiredLabel[0]

      optionallyRequiredLabels.push($optionalLabel[0]) unless isDup

    # console.log "after filtering: optionallyRequiredLabels:", optionallyRequiredLabels
    # all optionallyRequiredLabels get eui-required-grey-o
    $(optionallyRequiredLabels).addClass('eui-required-grey-o')
    # all requiredLabels get eui-required-o
    $(requiredLabels).addClass('eui-required-o')


  # get all fields at this required-level
  getAllFieldsAtRequiredLevel = (reqLevel, ancestor) ->
    $levelFields = $(ancestor).find("input[data-required-level='#{reqLevel}'], select[data-required-level='#{reqLevel}'], textarea[data-required-level='#{reqLevel}']")

  getLabelElem = (field) ->
    $label = $("label[for='#{$(field).id}']")

  getRequiredFieldsAtLevel = (reqLevel, ancestor) ->
    $levelFields = $(ancestor).find("input[data-required-level='#{reqLevel}'], select[data-required-level='#{reqLevel}'], textarea[data-required-level='#{reqLevel}']")
    $requiredFields = $levelFields.filter ->
      $id = this.id
      $label = $("label[for='#{$id}']") # get label matching the id
      $label.hasClass('required')

  getRequiredLabelsAndFieldsAtLevel = (reqLevel, ancestor) ->
    $levelFields = getAllFieldsAtRequiredLevel(reqLevel, ancestor)
    $requiredLabels = []
    $requiredFields = []
    $levelFields.each (index, field) ->
      id = $(field).attr('id')
      $label = $("label[for='#{id}']")
      if $label.length == 0
        # no label matched the id
        if /urls_\d*_urls_\d*$/.test id
          # field is a url input, need to grab the URL title
          urlParent = $(field).parent()
          $label = urlParent.siblings('label')
      if $label.hasClass('required')
        $requiredLabels.push($label)
        $requiredFields.push(field)
    [$requiredLabels, $requiredFields]

  addRequiredIconsToLabels = (labels) ->
    $(labels).each (index, label) ->
      $(label).addClass('eui-required-o')

  removeRequiredIconsFromLabels = (labels) ->
    $(labels).each (index, label) ->
      # console.log 'in removing icons. label:', label
      $(label).removeClass('eui-required-o')

  # see if any fields in group (level) have a value
  doFieldsHaveValue = (fields) ->
    return false if fields.length == 0
    values = $(fields).filter ->
      this.value
    values.length > 0 ? true : false

  addRequiredIconsWithRequiredLevel = (field) ->
    # currently only for Data Contacts Form because of data-required-level
    # get data-required-level
    # return unless $(field).data('required-level')?

    # get the highest ancestor of data-level-required for this field group
    # this might (probably?) be a div, not a form field
    $ancestor = $(field).closest('[data-required-level="1"]')
    # get required-level of field as integer
    reqLevel = parseInt($(field).data('required-level'), 10)

    isRequired = false

    # still using data-level to differentiate different field groups
    currentDataLevel = $(field).data('level') # current data-level
    dataLevels = currentDataLevel.split('_')

    # fields at current data-level
    $currentDataLevelFields = $ancestor.find("[data-level='#{currentDataLevel}']") # TODO using ancestor b/c of issues incrementing data-level in drafts.coffee
    if $currentDataLevelFields.length > 0
      values = $currentDataLevelFields.filter ->
        this.value
      # if fields have values
      if values.length > 0
        isRequired = true
        # addRequiredFields($topDataLevelFields) # this usually takes care of required icons at the same data level

    if isRequired
      for level in [1..reqLevel - 1]
        # add required icons to all levels above current level
        [$reqLabelsAtLevel, $reqFieldsAtLevel] = getRequiredLabelsAndFieldsAtLevel(level, $ancestor)

        addRequiredIconsToLabels($reqLabelsAtLevel)

      [$reqLabelsAtLevel, $reqFieldsAtLevel] = getRequiredLabelsAndFieldsAtLevel(level, $ancestor)
      labelsToAddIcons = []
      # test and add required icons for the current reqLevel. go through the
      # fields/labels test if fields at that data-level have values
      for field, index in $reqFieldsAtLevel
        fieldDataLevel = $(field).data('level')
        fieldsAtFieldDataLevel = $("[data-level='#{fieldDataLevel}']")
        if doFieldsHaveValue(fieldsAtFieldDataLevel)
          # if fields at the data level have values, add required icons to those labels
          labelsToAddIcons.push($reqLabelsAtLevel[index])
      addRequiredIconsToLabels(labelsToAddIcons) if labelsToAddIcons.length > 0

    else
      # get the max data-required-level on the page (currently just for Data Contacts)
      allReqLevelFields = $ancestor.find('[data-required-level]').not(['data-required-level="null"'])
      last = allReqLevelFields[allReqLevelFields.length - 1]
      maxRequiredLevel = parseInt($(last).data('required-level'), 10)

      keepRemoving = true
      for downLevel in [maxRequiredLevel..1] by -1
        return unless keepRemoving
        [$reqLabelsAtLevel, $reqFieldsAtLevel] = getRequiredLabelsAndFieldsAtLevel(downLevel, $ancestor)
        $allFieldsAtLevel = getAllFieldsAtRequiredLevel(downLevel, $ancestor)

        if doFieldsHaveValue($allFieldsAtLevel)
          # fields at the data-required-level have values

          # stop going down past this level and removing icons since we found a value
          keepRemoving = false

          labelsToRemoveIcons = []
          for field, index in $reqFieldsAtLevel
            # check the different data-level groups to only remove those that don't have values
            fieldDataLevel = $(field).data('level')
            fieldsAtFieldDataLevel = $("[data-level='#{fieldDataLevel}']")

            unless doFieldsHaveValue(fieldsAtFieldDataLevel)
              # fields in the data level don't have values, remove icons
              labelsToRemoveIcons.push($reqLabelsAtLevel[index])

          removeRequiredIconsFromLabels(labelsToRemoveIcons)
        else
          # the reqFieldsAtLevel DON'T have a value so required icons can be taken out
          removeRequiredIconsFromLabels($reqLabelsAtLevel)

  # Add required icons when a form field is updated
  $('.metadata-form, .umm-form').on 'blur', 'input, select, textarea', ->
    return if $(this).attr('type') == 'submit'
    addRequiredIcons(this)

  # Add required icons on page load
  $('.metadata-form, .umm-form').find('input, select, textarea').not(':disabled').each (index, field) ->
    addRequiredIcons(field)

  $('.metadata-form, .umm-form').on 'change', 'input[type="radio"], select', ->
    addRequiredIcons(this)
