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
      $longNameElement.attr('readonly', true)
    else
      $longNameElement.val('')
      $longNameElement.attr('readonly', false)

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

  $('.project-short-name-select').on 'select2:select', (event) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')

    $longNameElement = $element.parent().siblings().find('.project-long-name-select')

    if longName?
      $longNameElement.val(longName).trigger('change')
    else
      $longNameElement.val('').trigger('change')

  $('.project-long-name-select').on 'select2:select', (event) ->
    $element = $(this)
    shortName = $element.find(':selected').data('shortName')

    $shortNameElement = $element.parent().siblings().find('.project-short-name-select')

    if shortName?
      $shortNameElement.val(shortName).trigger('change')
    else
      $shortNameElement.val('').trigger('change')

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
      $longNameElement.attr('readonly', true)
    else
      $longNameElement.attr('readonly', false)

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
