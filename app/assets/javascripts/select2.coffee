disableAndDeselectOption = (select, placement)->
  $select = $(select)
  switch placement
    when 'first'
      $option = $select.find('option').first()
    when 'last'
      $option = $select.find('option').last()
  $option.prop('selected', false).prop('disabled', true)

enableAndSelectOption = (select, placement)->
  $select = $(select)
  switch placement
    when 'first'
      $option = $select.find('option').first()
    when 'last'
      $option = $select.find('option').last()
  $option.prop('disabled', false).prop('selected', true)

setDataCenterLongNameAndUrl = (dataCenterShortNameSelect, action) ->
  $shortNameSelect = $(dataCenterShortNameSelect)
  longName = $shortNameSelect.find(':selected').data('longName')
  url = $shortNameSelect.find(':selected').data('url')

  $longNameElement = $shortNameSelect.parent().siblings().find('.data-center-long-name')
  if longName?
    $longNameElement.val(longName)
  else
    $longNameElement.val('')

  if $shortNameSelect.hasClass('bulk-updates-data-center')
    # Bulk Updates form for Find & Update Data Center

    $relatedUrl = $shortNameSelect.parents('fieldset').find('.related-url')
    $urlElement = $relatedUrl.find('.bulk-updates-url')
    $urlContentTypeElement = $relatedUrl.find('.bulk-updates-related-url-content-type-select')
    $urlTypeElement = $relatedUrl.find('.bulk-updates-related-url-type-select')

    if (action == 'select' && url?) || (action == 'load' && $urlElement.val() != '')
      $urlElement.val(url) if action == 'select'
      disableAndDeselectOption($urlContentTypeElement, 'first')
      enableAndSelectOption($urlContentTypeElement, 'last')
      disableAndDeselectOption($urlTypeElement, 'first')
      enableAndSelectOption($urlTypeElement, 'last')
    else
      $urlElement.val('') if action == 'select'
      disableAndDeselectOption($urlContentTypeElement, 'last')
      enableAndSelectOption($urlContentTypeElement, 'first')
      disableAndDeselectOption($urlTypeElement, 'last')
      enableAndSelectOption($urlTypeElement, 'first')

    $shortNameSelect.blur() if action == 'select'
  else if $shortNameSelect.hasClass('tool-organization-short-name')
    # Tool Organization, which does not have RelatedURLs but has a URLValue
    $multipleItem = $shortNameSelect.closest('.multiple-item')
    $urlElement = $multipleItem.find('.tool-organization-url-value')

    if url?
      $urlElement.val(url)
      $urlElement.attr('readonly', true)
    else
      $urlElement.val('')
      $urlElement.attr('readonly', false)
  else
    # Collection Drafts form for Data Centers
    $multipleItem = $shortNameSelect.closest('.multiple-item')
    $dataContactType = $shortNameSelect.closest('.data-contact-type')

    if $dataContactType.length > 0
      # the select is in the data contact form, so use the data contact type we are in
      $relatedUrl = $dataContactType.find('.related-urls:first')
    else
      $relatedUrl = $multipleItem.find('.related-urls:first')

    $urlElement = $relatedUrl.find('.url:first')
    $urlContentTypeElement = $relatedUrl.find('.related-url-content-type-select:first')

    if url?
      $urlElement.val(url)
      $urlElement.attr('readonly', true)

      # UMM-S doesn't currently limit the URL Content Types of Related URLs, so do not auto select a content type unless there is only 1 option (plus the prompt)
      $urlContentTypeElement.find('option').last().prop 'selected', true if $urlContentTypeElement.find('option').length == 2
      $urlContentTypeElement.trigger('change')
    else
      $urlElement.attr('readonly', false)

      if action == 'select'
        $urlElement.val('')
        $urlContentTypeElement.find('option').first().prop 'selected', true
        $urlContentTypeElement.trigger('change')

      else if $urlElement.val() == '' && !$urlContentTypeElement.find('option:disabled:selected')?
        # action is load and URL was not prepopulated on load
        # but don't change the URL Content Type if there is a disabled (aka invalid) selection
        $urlContentTypeElement.find('option').first().prop 'selected', true
        $urlContentTypeElement.trigger('change')

    $urlElement.blur() if action == 'select'

$(document).ready ->
  # set short name as select2 field
  $('.select2-select').select2()

  $('.data-center-short-name-select').on 'select2:select', (event) ->
    # when selecting short name, populate long name, url and other related url options
    # as well as set readonly and disabled options
    setDataCenterLongNameAndUrl(this, 'select')

  $('.data-center-short-name-select').each (index, element) ->
    # Set long name and related url elements if short name is selected on load
    setDataCenterLongNameAndUrl(this, 'load')

  # when selecting short name, populate long name
  $('.project-short-name-select').on 'select2:select', (event) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')

    $longNameElement = $element.parent().siblings().find('.project-long-name')

    if longName?
      $longNameElement.val(longName)
    else
      $longNameElement.val('')

  # when selecting short name, populate long name
  $('.platform-short-name-select').on 'select2:select', (event) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')
    type = $element.find(':selected').data('type')

    $longNameElement = $element.parent().siblings().find('.platform-long-name')
    $typeElement = $element.parents('.platform-fields').find('input.platform-type')
    $typeSpan = $element.parents('.platform-fields').find('span.platform-type')

    if type?
      $typeElement.val(type)
      $typeSpan.text(type)
      $typeSpan.removeClass('default')
    else
      $typeElement.val('')
      $typeSpan.text('Please select a Short Name')
      $typeSpan.addClass('default')

    if longName?
      $longNameElement.val(longName)
    else
      $longNameElement.val('')

  # Set long name element if short name is selected on load
  $('.project-short-name-select').each (index, element) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')
    url = $element.find(':selected').data('url')

    $longNameElement = $element.parent().siblings().find('.project-long-name')

    if longName?
      $longNameElement.val(longName)

  # Set long name element if short name is selected on load
  $('.platform-short-name-select').each (index, element) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')
    url = $element.find(':selected').data('url')

    $longNameElement = $element.parent().siblings().find('.platform-long-name')

    if longName?
      $longNameElement.val(longName)

  # when selecting short name, populate long name
  $('.instrument-short-name-select').on 'select2:select', (event) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')

    $longNameElement = $element.parent().siblings().find('.instrument-long-name')

    if longName?
      $longNameElement.val(longName)
    else
      $longNameElement.val('')
      $longNameElement.trigger('blur')

  # Set long name element to readonly if short name is selected on load
  $('.instrument-short-name-select').each (index, element) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')
    url = $element.find(':selected').data('url')

    $longNameElement = $element.parent().siblings().find('.instrument-long-name')

    if longName?
      $longNameElement.val(longName)
