$(document).ready ->

  $('.download-xml').on 'click', (element) ->
    url = $(element.target).data('path')
    token = $(element.target).data('token')
    token = "?token=#{token}" if token?
    $('#download-xml-modal div p a').each (index, link) ->
      if $(link).attr('id') == 'native'
        $(link).attr('href', "#{url}#{token}")
      else
        $(link).attr('href', "#{url}.#{$(link).attr('id')}#{token}")
