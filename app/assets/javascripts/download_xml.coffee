$(document).ready ->

  $('.download-xml').on 'click', (element) ->
    url = $(element.target).data('path')
    $('#download-xml-modal div p a').each (index, link) ->
      if $(link).attr('id') == 'native'
        $(link).attr('href', url)
      else
        $(link).attr('href', "#{url}.#{$(link).attr('id')}")
