###
#
# Chooser - dynamic, AJAX-enabled pick-list
#
# @author James LastName
# v2.0 (rewritten in CoffeeScript)
#
# Configuration parameters:
# id (string):             Unique ID for this widget. All HTML elements within this widget will
#                          have IDs based on this.
# url (string):            URL of resource to retrieve initial selections.
# target (element):        DOM element where this widget will be placed.
# fromLabel:               Label to appear over "from" list
# toLabel:                 Label to appear over "to" list
# forceUnique (boolean):   When true, only allows unique options to be added to the "to" list,
#                          e.g., if "ABC" is already in the "to" list, it will not be added. Default is false.
# size (int):              Height of select control in number of options.
# resetSize (int):         When user scrolls to top, the entire list is trimmed to this size. Not required,
#                          default is 50.
# filterChars (sting):     Number of characters to allow typing into filter textbox before AJAX call is triggered.
#                          Default is 1.
# showNumChosen (int):     Always show the number of chosen items in the "to" list.
# attachTo (element):      DOM element where a value can be stored (hidden or text input).
# errorCallback (function): Callback function to execute if an AJAX error occurs.
# fromFilterText (string): Text for the "from" filter textbox placeholder (default is "filter")
# toFilterText (string):   Text for the "to" filter textbox placeholder (default is "filter")
# removeAdded (boolean):   Remove selections from the FROM list as they are added to the TO list. Default is true,
# allowRemoveAll (boolean): Show the remove all button
# lowerFromLabel (string):  Text to display under the FROM list. Can be used with a template, e.g.,
#                           'Showing {{x}} of {{n}} items.' where x is the number of items loaded in the FROM list
#                           and x is the total number of hits that come back from the server (both are optional).
# toMax (int or boolean):   Total number of items that can be in the right ("to") box. Default: 500. Set to false
#                           allow any number. A message is displayed if the user attempts to add more than the max.
#
#
# Public methods:
#
# init()                   Initialize and render the widget.
# val()                    Get the currently selected "to" values.
# getDOMNode()             Returns the DOM node for customization.
# addValues(list)          Adds values to the "from" list
# setValues(list)          Removes current values from "from" list and adds new ones.
# removeFromBottom(n)      Remove n values from bottom of "from" list.
#
# NOTES: Data format shall be formatted in the following ways:
#
#          1) An array of strings. Every value will be used for the option value and display value.
#          For example, ["lorem", "ipsum", "dolor", "sit", "amet"]
#
#          2) An array of 2-element arrays. First element is the option value, the second is the display value.
#          For example, [ ["lorem", "Lorem"], ["ipsum", "Ipsum"] ...  ]
#
#          3) A mixed array: [ ["lorem", "Lorem"], "ipsum",  "dolor", ["sit", "Sit"] ... ]
#
#          4) An array of single- or dual-element arrays.
#          For example, [ ["lorem", "Lorem"], ["ipsum"] ...  ]
#
#          5) Any combination of the above.
#
###

# Constructor
window.Chooser = (config) ->
# Globals
  OUTER_CONTAINER = undefined
  FROM_CONTAINER = undefined
  TO_CONTAINER = undefined
  BUTTON_CONTAINER = undefined
  FROM_BOX = undefined
  FROM_LIST = undefined
  TO_BOX = undefined
  TO_LIST = undefined
  ADD_BUTTON = undefined
  REMOVE_BUTTON = undefined
  REMOVE_ALL_BUTTON = undefined
  FROM_LABEL = undefined
  TO_LABEL = undefined
  FROM_FILTER_TEXTBOX = undefined
  TO_FILTER_TEXTBOX = undefined
  TO_MESSAGE = undefined
  CHOOSER_OPTS_STORAGE_KEY = 'Chooser_opts_' + config.id
  PAGE_NUM = 1
  LOWER_FROM_LABEL = undefined
  LOWER_TO_LABEL = undefined
  TOTAL_HITS = undefined
  SELF = undefined

  ###
  # init - initializes the widget.
  ###
  @init = ->
    SELF = this

    # Set defaults:
    setDefault('id', 'Chooser_' + Math.random().toString(36).slice(2))
    setDefault('fromLabel', 'Available')
    setDefault('toLabel', 'Selected')
    setDefault('forceUnique', true)
    setDefault('size', 20)
    setDefault('filterChars', 1)
    setDefault('resetSize', 50)
    setDefault('showNumChosen', true)
    setDefault('fromFilterText', 'Enter text to narrow search results')
    setDefault('toFilterText', 'Enter text to narrow selected items')
    setDefault('removeAdded', false)
    setDefault('allowRemoveAll', true)
    setDefault('lowerFromLabel', 'Showing {{x}} of {{n}} item{{s}}')
    setDefault('lowerToLabel', 'Showing {{x}} of {{n}} item{{s}}')
    setDefault('toMax', false)
    setDefault('endlessScroll', false)
    setDefault('uniqueMsg', 'Value already added')
    setDefault('delimiter', ',')
    setDefault('tooltipObject', 'Collections')

    # Construct each component
    OUTER_CONTAINER = $('<div>').addClass('Chooser').attr('id', config.id)
    FROM_CONTAINER = $('<div>').addClass('from-container')
    TO_CONTAINER = $('<div>').addClass('to-container')
    BUTTON_CONTAINER = $('<div>').addClass('button-container')
    FROM_BOX = $('<div>')
    TO_BOX = $('<div>')

    addButtonText = if hasProp('addButton', 'object') then config.addButton.text else '&#x2192;'
    addButtonCssClass = if hasProp('addButton', 'object') then config.addButton.cssClass else ''
    ADD_BUTTON = $('<button>').attr('title', "Add highlighted items to 'Selected #{config.tooltipObject}'").attr('type', 'button').addClass(addButtonCssClass).addClass('add_button').text(addButtonText)
    if hasProp('addButton') and config.addButton.arrowCssClass
      $(ADD_BUTTON).append('<span>').addClass(config.addButton.arrowCssClass)

    delButtonText = if hasProp('delButton', 'object') then config.delButton.text else '&#x2190;'
    delButtonCssClass = if hasProp('delButton', 'object') then config.delButton.cssClass else ''
    REMOVE_BUTTON = $('<button>').attr('title', "Remove highlighted items from 'Selected #{config.tooltipObject}'").attr('type', 'button').addClass(delButtonCssClass).addClass('remove_button').text(delButtonText)
    if hasProp('delButton') and config.delButton.arrowCssClass
      $(REMOVE_BUTTON).prepend('<span>').addClass(config.delButton.arrowCssClass)

    allowRemoveAll = if hasProp('allowRemoveAll', 'boolean') then config.allowRemoveAll else true
    if allowRemoveAll == true
      delAllButtonText = if hasProp('delAllButton', 'object') then config.delAllButton.text else '&#x2190;'
      delAllButtonCssClass = if hasProp('delAllButton', 'object') then config.delAllButton.cssClass else ''

      REMOVE_ALL_BUTTON = $('<button>').attr('title', "Remove all entries from 'Selected #{config.tooltipObject}'").attr('type', 'button').addClass(delAllButtonCssClass).addClass('remove_all_button').text(delAllButtonText)
      if hasProp('delAllButton') and config.delAllButton.arrowCssClass
        $(REMOVE_ALL_BUTTON).prepend('<span>').addClass(config.delAllButton.arrowCssClass)

    FROM_LIST = $('<select>').addClass('___fromList').attr('id', config.id + '_fromList').attr( 'multiple', true).attr('size', config.size)
    TO_LIST = $('<select>').addClass('___toList').attr('name', config.id + '_toList[]').attr('id', config.id + '_toList').attr('multiple', true).attr('size', config.size)

    fromPlaceHolderText = if hasProp('fromFilterText', 'string') then config.fromFilterText else 'filter'
    FROM_FILTER_TEXTBOX = $('<input>').attr('type', 'text').attr('placeholder', fromPlaceHolderText).attr('id', 'from-filter')

    toPlaceHolderText = if hasProp('toFilterText', 'string') then config.toFilterText else 'filter'
    TO_FILTER_TEXTBOX = $('<input>').attr('type', 'text').attr('placeholder', toPlaceHolderText).attr('id', 'to-filter')

    if !config.hasOwnProperty('resetSize')
      config.resetSize = 50

    if hasProp('fromLabel', 'string')
      FROM_LABEL = $('<label>').attr('for', config.id + '_fromList').text(config.fromLabel)

    if ! hasProp('lowerFromLabel') || hasProp('lowerFromLabel', 'string')
      LOWER_FROM_LABEL = $('<p>').addClass('form-description')

    if ! hasProp('lowerToLabel') || hasProp('lowerToLabel', 'string')
      LOWER_TO_LABEL = $('<p>').addClass('form-description')

    if config.toLabel
      TO_LABEL = $('<label>').attr('for', config.id + '_toList').text(config.toLabel)
      $(TO_CONTAINER).append TO_LABEL

    # Assemble the components
    $(OUTER_CONTAINER).append FROM_CONTAINER
    $(OUTER_CONTAINER).append BUTTON_CONTAINER
    $(OUTER_CONTAINER).append TO_CONTAINER

    $(FROM_CONTAINER).append FROM_LABEL
    $(FROM_CONTAINER).append FROM_FILTER_TEXTBOX
    $(FROM_CONTAINER).append FROM_LIST
    $(FROM_CONTAINER).append LOWER_FROM_LABEL

    $(TO_CONTAINER).append TO_FILTER_TEXTBOX
    $(TO_CONTAINER).append TO_LIST
    $(TO_CONTAINER).append LOWER_TO_LABEL

    $(BUTTON_CONTAINER).append ADD_BUTTON
    $(BUTTON_CONTAINER).append REMOVE_BUTTON
    $(BUTTON_CONTAINER).append REMOVE_ALL_BUTTON
    $(OUTER_CONTAINER).appendTo $(config.target)

    TO_MESSAGE = $('<span>').addClass('to_message')
    $(TO_CONTAINER).append TO_MESSAGE

    $(ADD_BUTTON).click addButtonClick
    $(REMOVE_BUTTON).click removeButtonClick
    $(REMOVE_ALL_BUTTON).click removeAllButtonClick
    SELF.getRemoteData 'first'
    $(FROM_LIST).on 'scroll', (evt) ->
      if config.endlessScroll == false
        return
      lowerBoundary = $(this).position().top + parseInt($(this).css('height'))
      upperBoundary = $(this).position().top
      lastOpt = $(this).find('option').last()
      lastOptPos = $(lastOpt).position().top
      firstOpt = $(this).find('option').first()
      firstOptPos = $(firstOpt).position().top
      lastOptHeight = parseInt($(lastOpt).css('height'))
      if lastOptPos <= lowerBoundary
        dist = lowerBoundary - lastOptPos
        offset = lastOptHeight - dist
        if offset > 1 and offset < 5
          SELF.getRemoteData 'next'
      if firstOptPos >= upperBoundary
        SELF.removeFromBottom()
        PAGE_NUM = 1
      return


    $(TO_LIST).change ->
      numChosen = $(TO_LIST).find('option').length

      if ! hasProp('lowerToLabel') || hasProp('lowerToLabel', 'string')
        x = $(TO_LIST).find('option').not('.is-hidden').length

        lowerToLabelText = config.lowerToLabel
        lowerToLabelText = lowerToLabelText.replace '{{x}}', x
        lowerToLabelText = lowerToLabelText.replace '{{n}}', numChosen
        lowerToLabelText = lowerToLabelText.replace('{{s}}', pluralize(numChosen))
        $(LOWER_TO_LABEL).text(lowerToLabelText)

      if hasProp('toLabel') and hasProp('showNumChosen')
        if config.showNumChosen == true and numChosen > 0
          $(TO_LABEL).text config.toLabel + ' (' + numChosen + ')'
        else
          $(TO_LABEL).text config.toLabel

      if hasProp('attachTo', 'object')
        $(config.attachTo).val SELF.val().join(config.delimiter)

      return

    $(FROM_LIST).change ->
      if ! hasProp('lowerFromLabel') || hasProp('lowerFromLabel', 'string')
        x = $(FROM_LIST).find('option').length
        n = TOTAL_HITS

        lowerFromLabelText = config.lowerFromLabel
        lowerFromLabelText = lowerFromLabelText.replace '{{x}}', x
        lowerFromLabelText = lowerFromLabelText.replace '{{n}}', n
        lowerFromLabelText = lowerFromLabelText.replace('{{s}}', pluralize(n))
        $(LOWER_FROM_LABEL).text(lowerFromLabelText)

      return

    $(FROM_FILTER_TEXTBOX).keyup initFromFilter
    $(TO_FILTER_TEXTBOX).keyup initToFilter

    $(FROM_LIST).dblclick ->
      $(ADD_BUTTON).click()
      return

    $(TO_LIST).dblclick ->
      $(REMOVE_BUTTON).click()
      return

  ###
  # Set provided config values
  #
  ###
  @setConfig = (key, value) ->
    config[key] = value

  ###
  # Sets the values in the "TO" list.
  #
  ###
  @setToVal = (values) ->
    setVal(values, $(TO_LIST))

  ###
  # Sets the values in the "FROM" list.
  #
  ###
  @setFromVal = (values) ->
    setVal(values, $(FROM_LIST))

  ###
  # Returns the widget's "value" (selected values).
  #
  # @returns {*|object}
  ###
  @val = () ->
    vals = $(TO_LIST).find('option').map((tmpKey, tmpVal) ->
      $(tmpVal).text()
    )
    valsAsArray = []
    $.each vals, (tmpKey, tmpVal) ->
      valsAsArray.push tmpVal
      return
    valsAsArray

  ###
  # Returns the top-level DOM node of this widget.
  # @returns {*|jQuery|HTMLElement}
  ###
  @getDOMNode = ->
    $ OUTER_CONTAINER

  ###
  # Removes N values from top of FROM list.
  #
  # @param n - number of values to remove.
  ###
  @removeFromTop = (n) ->
    list = $(FROM_LIST).find('option')
    listSize = $(list).length
    numOptsToRemove = listSize - (config.resetSize)
    $(FROM_LIST).find('option').each (tmpKey, tmpVal) ->
      if tmpKey < numOptsToRemove
        $(tmpVal).remove()
      return
    return

  ###
  # Remove N values from bottom of list.
  ###
  @removeFromBottom = ->
    list = $(FROM_LIST).find('option')
    listSize = $(list).length
    numOptsToRemove = listSize - (config.resetSize)
    if listSize < 1
      return
    revList = []
    # reverse the list
    $.each list, (tmpKey, tmpVal) ->
      revList.unshift tmpVal
      return
    $.each revList, (tmpKey, tmpVal) ->
      if tmpKey < numOptsToRemove
        $(tmpVal).remove()
      return
    return

  ###
  # Remove any stored selections.
  ###
  @clearSelections = ->
    if sessionStorage
      sessionStorage.removeItem CHOOSER_OPTS_STORAGE_KEY
    return

  # Private functions: -----------------------------

  flashToMsg = (msg) ->
    $(TO_MESSAGE).text(msg)
    setTimeout (->
      $(TO_MESSAGE).text ''
      return
    ), 2000

  setVal = (values, which) ->
    if values and typeof values == 'object'
      $(which).empty()
      $.each values, (tmpKey, tmpVal) ->

        s3Prefixes = tmpVal[2] if config.showS3Buckets

        if typeof tmpVal == 'object' and tmpVal.length > 1
          optVal = tmpVal[0]
          dispVal = tmpVal[1]
        else if typeof tmpVal == 'object' and tmpVal.length == 1
          dispVal = optVal = tmpVal[0]
        else
          dispVal = optVal = tmpVal

        opt = $('<option>')
                .val(optVal)
                .text(if s3Prefixes then "🟠 #{dispVal}" else dispVal)
                .attr('title', if s3Prefixes then dispVal + s3Prefixes else dispVal)
                .addClass('icon-s3' if s3Prefixes)

        $(which).append opt
        return

      $(which).trigger 'change'

    sortOptions(which)

  ###
  # Trigger the filter textbox action.
  #
  # @param e
  ###
  initFromFilter = (e) ->
    if $(this).val().length >= config.filterChars
      SELF.getRemoteData 'filter'
    else
      SELF.getRemoteData 'first'
    return

  # Filter the TO side of the chooser
  # This only fiters based on the visible text
  initToFilter = ->
    # Clear the selected values first so that the user cannot have options
    # that are both selected and invisible because they've been filtered.
    $('.___toList').val('')
    SELF.toFilter($(this).val())
    $(TO_LIST).trigger 'change'

  @toFilter = (filterText) ->
    $(TO_LIST).find('option').each (index, option) ->
      if $(option).text().toLowerCase().indexOf(filterText.toLowerCase()) == -1
        $(option).addClass('is-hidden')
      else
        $(option).removeClass('is-hidden')

  ###
  # Makes the AJAX calls to get the data from the remote server.
  #
  # @param type
  ###
  @getRemoteData = (type) ->

    url = config.url

    queryJoinChar = '?'

    if url.match(/\?/)
      queryJoinChar = '&'

    overwrite = false
    if type == 'first'
      overwrite = true
      url += queryJoinChar + config.nextPageParm + '=1'
      PAGE_NUM = 1
    else if type == 'next'
      PAGE_NUM++
      url += queryJoinChar + config.nextPageParm + '=' + PAGE_NUM
    else if type == 'filter'
      overwrite = true
      url += queryJoinChar + config.filterParm + '=' + $(FROM_FILTER_TEXTBOX).val()

    $.ajax('url': url).done((resp) ->
      TOTAL_HITS = resp.hits
      SELF.setFromVal resp.items
      return
    ).fail (resp) ->
      console.error 'ERROR--->Could not retrieve values. Reason:'
      console.error resp.statusCode
      console.error resp.responseText
      if hasProp('errorCallback', 'function')
        config.errorCallback.call()
      return
    return

  ###
  # Add button click action.
  #
  # @param e - the click event
  ###
  addButtonClick = (e) ->
    e.preventDefault()

    removeAdded = if hasProp('removeAdded', 'boolean') then config.removeAdded else true

    if ! hasProp('toMax') || hasProp('toMax', 'number')
      toListSize = $(TO_LIST).find('option').length
      fromListSize = $(FROM_LIST).find('option:selected').length

      if (toListSize + fromListSize) > config.toMax
        flashToMsg('Only ' + config.toMax + ' items may be selected.')
        return

    if hasProp("removeAdded", "boolean") && config.removeAdded
      $(FROM_LIST).find('option:selected').appendTo($(TO_LIST))
    else
      $(FROM_LIST).find('option:selected').clone().appendTo($(TO_LIST))

    # disable the selected values in FROM_LIST
    $(FROM_LIST).find('option:selected').prop('disabled', true)

    # apply filter to TO_LIST
    # initToFilter
    SELF.toFilter($(TO_FILTER_TEXTBOX).val())

    if ( hasProp('forceUnique', 'boolean') && hasProp('removeAdded', 'boolean') ) && ( config.forceUnique && ! config.removeAdded )
      found = []
      $(TO_LIST).find('option').each () ->
        if($.inArray(this.value, found) != -1)
          flashToMsg(config.uniqueMsg)
          $(this).remove()
        found.push(this.value)
        return

      $(TO_LIST).trigger 'change'

      # Sort the list every time
      sortOptions(TO_LIST)

      $(TO_LIST).blur()
      return

    return

  ###
  # Remove button click action.
  #
  # @param e - the click event
  # @param remAll - boolean indicating whether or not to remove
  # all values from the FROM list.
  ###
  removeButtonClick = (e, remAll) ->
    e.preventDefault()
    query = if remAll then 'option' else 'option:selected'

    $(TO_LIST).find(query).each (tmpKey, tmpVal) ->
      fromListVal = $(tmpVal).attr('value')

      # enable the FROM_LIST option
      $(FROM_LIST).find("option[value='#{fromListVal}']").prop('disabled', false)

      toListVal = $(TO_LIST).find('option').filter () ->
        if fromListVal == $(this).val()
          return true
      toListVal = $(toListVal).val()

      if fromListVal != toListVal
        clonedOpt = $(tmpVal).clone()
        $(FROM_LIST).prepend clonedOpt

      $(tmpVal).remove()
      return

    $(TO_LIST).trigger 'change'

    # Sort the list every time
    sortOptions(TO_LIST)

    $(TO_LIST).blur()
    return

  removeAllButtonClick = (e) ->
    removeButtonClick e, true
    return

  ###
  # Convenience method to test for presence of
  # a config option.
  #
  # Examples:
  # hasProp("someProp", "object")
  # hasProp("foo", "string")
  # hasProp("bar", "function")
  # hasProp("baz")
  #
  # @param name - config key
  # @param type - data type
  # @returns {boolean}
  ###
  hasProp = (name, type) ->
    if config.hasOwnProperty(name)
      if type
        _t = typeof config[name]
        if _t == type
          true
        else
          false
      else
        true
    else
      false

  ###
  # Sets a default value for a configuration property.
  # Example: setDefault('someMax', 200) sets config.max to 200 unless
  # it was already set.
  ###
  setDefault = (name, value) ->
    if ! hasProp(name)
      config[name] = value

  ###
  # Convenience method to handle logic of plural words.
  #
  # Examples:
  # pluraize(4) --> 's'
  # pluraize(1) --> ''
  # pluraize(0) --> 's'
  ###
  pluralize = (count) ->
    if count > 1 || count < 1
      return 's'
    else
      return ''

  ###
  # Sorts a list of select options alphabetically by the option text
  ###
  sortOptions = (selectElem) ->
    sorted = $(selectElem).find('option').sort( (a,b) ->
      # we replace '🟠 ' to inhibit the emoji's unicode from interfering with
      # the alpha-sorting. If no '🟠 ' is found, nothing is changed
      an = $(a).text().toLowerCase().replace('🟠 ','')
      bn = $(b).text().toLowerCase().replace('🟠 ','')
      if(an > bn)
        return 1
      if(an < bn)
        return -1
      return 0
    ).clone()

    $(selectElem).find("option").remove()
    $(selectElem).append(sorted)

  return
