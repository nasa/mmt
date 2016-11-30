$(document).ready ->
  # set short name as select2 field
  $('.select2-select').select2()

  if $('.metadata-form').length > 0
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

      if longName?
        $longNameElement.val(longName)
        $longNameElement.attr('readonly', true)
      else
        $longNameElement.attr('readonly', false)

      if url?
        $urlElement.val(url)
        $urlElement.attr('readonly', true)
      else
        $urlElement.attr('readonly', false)

  if $('.group-form').length > 0
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
