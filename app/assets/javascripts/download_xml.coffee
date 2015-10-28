$(document).ready ->
  $('.download-xml-link').leanModal
    top: 200
    overlay: 0.6
    closeButton: '.modal-close'

  $('.download-xml-link').on 'click', (element) ->
    url = $(element.target).data('path')
    $('#download-xml-modal div p a').each (index, link) ->
      if $(link).attr('id') == 'native'
        $(link).attr('href', url)
      else
        $(link).attr('href', "#{url}.#{$(link).attr('id')}")
