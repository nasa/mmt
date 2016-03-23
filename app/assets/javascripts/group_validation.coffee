$(document).ready ->
  # Validate group form
  if $('.group-form').length > 0
    $('.required').on 'blur', () ->
      $element = $(this)
      if $element.val() == ''
        id = $element.attr('id')
        label = $("label[for='#{id}']")
        field = label.text()

        message = '<i class="fa fa-exclamation-triangle"></i>'
        message += "#{field} is required."

        classes = 'eui-banner eui-banner-danger validation-error'
        classes += ' half-width' if $element.hasClass('half-width')

        errorElement = $('<div/>',
          id: "#{id}_error"
          class: classes
          html: message
        )

        # remove prior error message if it exists before adding current one
        if $element.next().hasClass('validation-error')
          $element.next().remove()

        $(errorElement).insertAfter($element)
      else
        # remove error if field is no longer empty
        $nextElement = $element.next()
        $nextElement.remove() if $nextElement.hasClass('validation-error')
