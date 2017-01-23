$(document).ready ->

  $('.download-xml').on 'click', (element) ->
    url = $(element.target).data('path')
    token = $(element.target).data('token')
    token = if token? then "?token=#{token}" else ''
    $('#download-xml-modal div p a').each (index, link) ->
      $(link).attr('href', "#{url}.#{$(link).attr('id')}#{token}")
