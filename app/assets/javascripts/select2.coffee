$(document).ready ->
  # set short name as select2 field
  $('.select2-select').select2()

  # when selecting short name, populate long name and set to readonly
  # TODO since we are using select2 in multiple places, maybe this class should be more specific?
  $('.select2-select').on 'select2:select', (event) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')
    url = $element.find(':selected').data('url')

    $longNameElement = $element.parent().siblings().find('.organization-long-name')
    $mainItemParent = $element.parents('.sub-fields').parent('.eui-accordion__body')
    $urlElement = $mainItemParent.find('.url').first()

    if longName?
      $longNameElement.val(longName)
      $longNameElement.attr('readonly', true)
    else
      $longNameElement.val('')
      $longNameElement.attr('readonly', false)

    if url?
      $urlElement.val(url)
      $urlElement.attr('readonly', true)
    else
      $urlElement.val('')
      $urlElement.attr('readonly', false)

  # Set long name element to readonly if short name is selected on load
  $('.select2-select').each (index, element) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')
    url = $element.find(':selected').data('url')

    $longNameElement = $element.parent().siblings().find('.organization-long-name')
    $mainItemParent = $element.parents('.sub-fields').parent('.eui-accordion__body')
    $urlElement = $mainItemParent.find('.url').first()

    if longName?
      $longNameElement.attr('readonly', true)
    else
      $longNameElement.attr('readonly', false)

    if url?
      $urlElement.attr('readonly', true)
    else
      $urlElement.attr('readonly', false)

  # Set placeholder for group filters
  $('.provider-filter').select2(
    placeholder: "Filter by provider"
  )
  $('.member-filter').select2(
    tags: true
    placeholder: "Filter by member"
  )
