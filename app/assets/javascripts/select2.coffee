$(document).ready ->
  # set short name as select2 field
  $('.select2-select').select2()

  # when selecting short name, populate long name and url and set to readonly
  $('.data-center-short-name-select').on 'select2:select', (event) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')
    url = $element.find(':selected').data('url')

    $longNameElement = $element.parent().siblings().find('.data-center-long-name')

    $multipleItem = $element.closest('.multiple-item')
    $dataContactType = $element.closest('.data-contact-type')

    if $dataContactType.length > 0
      # the select is in the data contact form, so use the data contact type we are in
      $relatedUrl = $dataContactType.find('.related-urls:first')
    else
      $relatedUrl = $multipleItem.find('.related-urls:first')

    $urlElement = $relatedUrl.find('.url:first')
    $urlContentTypeElement = $relatedUrl.find('.related-url-content-type-select:first')

    if longName?
      $longNameElement.val(longName)
    else
      $longNameElement.val('')

    if url?
      $urlElement.val(url)
      $urlElement.attr('readonly', true)
      $urlContentTypeElement.find('option').last().prop 'selected', true
      $urlContentTypeElement.trigger('change')
    else
      $urlElement.val('')
      $urlElement.attr('readonly', false)
      $urlContentTypeElement.find('option').first().prop 'selected', true
      $urlContentTypeElement.trigger('change')
    $urlElement.blur()

  # Set long name and url elements to readonly if short name is selected on load
  $('.data-center-short-name-select').each (index, element) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')
    url = $element.find(':selected').data('url')

    $longNameElement = $element.parent().siblings().find('.data-center-long-name')

    $multipleItem = $element.closest('.multiple-item')
    $dataContactType = $element.closest('.data-contact-type')

    if $dataContactType.length > 0
      # the select is in the data contact form, so use the data contact type we are in
      $relatedUrl = $dataContactType.find('.related-urls:first')
    else
      $relatedUrl = $multipleItem.find('.related-urls:first')

    $urlElement = $relatedUrl.find('.url:first')
    $urlContentTypeElement = $relatedUrl.find('.related-url-content-type-select:first')

    if longName?
      $longNameElement.val(longName)

    if url?
      $urlElement.val(url)
      $urlElement.attr('readonly', true)
      $urlContentTypeElement.find('option').last().prop 'selected', true
      $urlContentTypeElement.trigger('change')
    else
      $urlElement.attr('readonly', false)

      # If URL wasn't prepopulated on load
      if $urlElement.val() == ''
        $urlContentTypeElement.find('option').first().prop 'selected', true
        $urlContentTypeElement.trigger('change')


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

  # Set long name element to readonly if short name is selected on load
  $('.project-short-name-select').each (index, element) ->
      $element = $(this)
      longName = $element.find(':selected').data('longName')
      url = $element.find(':selected').data('url')

      $longNameElement = $element.parent().siblings().find('.project-long-name')

      if longName?
        $longNameElement.val(longName)

  # Set long name element to readonly if short name is selected on load
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

  # Set long name element to readonly if short name is selected on load
  $('.instrument-short-name-select').each (index, element) ->
      $element = $(this)
      longName = $element.find(':selected').data('longName')
      url = $element.find(':selected').data('url')

      $longNameElement = $element.parent().siblings().find('.instrument-long-name')

      if longName?
        $longNameElement.val(longName)
