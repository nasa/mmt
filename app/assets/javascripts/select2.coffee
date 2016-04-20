$(document).ready ->
  # set short name as select2 field
  $('.select2-select').select2()

  # when selecting short name, populate long name and set to readonly
  $('.select2-select').on 'select2:select', (event) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')

    $longNameElement = $element.parent().siblings().find('.organization-long-name')

    if longName?
      $longNameElement.val(longName)
      $longNameElement.attr('readonly', true)
    else
      $longNameElement.val('')
      $longNameElement.attr('readonly', false)

  # Set long name element to readonly if short name is selected on load
  $('.select2-select').each (index, element) ->
    $element = $(this)
    longName = $element.find(':selected').data('longName')

    $longNameElement = $element.parent().siblings().find('.organization-long-name')

    if longName?
      $longNameElement.attr('readonly', true)
    else
      $longNameElement.attr('readonly', false)

  # Set placeholder for group filters
  $('.provider-filter').select2(
    placeholder: "Filter by provider"
  )
  $('.member-filter').select2(
    tags: true
    placeholder: "Filter by member"
    matcher: (searchTerm, entry) ->
      return entry if searchTerm.term == undefined

      term = searchTerm.term.toLowerCase()
      text = entry.text.toLowerCase()
      value = entry.id.toLowerCase()

      if value.match(term) || text.match(term)
        entry
      else
        false
  )
