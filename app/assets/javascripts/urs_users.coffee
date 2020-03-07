select2GroupMemberFormatter = (result) ->
  result.text + ' <small><b>' + result.id + '</b></small>'

select2Sorter = (a, b) ->
  if (a > b)
    return 1
  if (a < b)
    return -1
  return 0

select2HTMLSorter = (a, b) ->
  select2Sorter(a.title, b.title)

select2JSONSorter = (a, b) ->
  select2Sorter(a.text, b.text)

setCurrentGroupMembers = ->
  $.each $('.urs_autocomplete'), ->
    selectedUsers = $.map $(this).find('option'), (option) ->
      $(option).val()

    $(this).val(selectedUsers).trigger('change')


$(document).ready ->
  $('.urs_autocomplete').select2
    minimumInputLength: 3
    type: 'GET'
    dataType: 'json'
    ajax:
      delay: 500
      url: '/groups/urs_search'
      data: (params) ->
        search: params.term

      processResults: (data) ->
        results: data
        more: false

    templateResult: (result) ->
      if !result.id
        return result.text

      select2GroupMemberFormatter(result)

    templateSelection: (result) ->
      select2GroupMemberFormatter(result)

    escapeMarkup: (text) ->
      text

    sorter: (data) ->
      # Sort the search results
      data.sort select2JSONSorter

  .on 'select2:select', (event) ->
    # Sort the selected members each time a new one is added
    $(this).next().find('.select2-selection__rendered li.select2-selection__choice')
      .sort(select2HTMLSorter)
    .prependTo($(this).parent().find('.select2-selection__rendered'))

  setCurrentGroupMembers()
