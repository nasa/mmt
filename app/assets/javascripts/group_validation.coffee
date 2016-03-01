$(document).ready ->
  # Validate group form
  if $('.group-form').length > 0
    # required fields
    $('.required').on 'blur', () ->
      el = $(this)
      if el.val() == ''
        id = el.attr('id')
        label = $("label[for='" + id + "']")
        field = label.text()

        message = '<i class="fa fa-exclamation-triangle"></i>'
        message += "#{field} is a required"

        classes = 'banner banner-danger validation-error'
        classes += ' half-width' if el.hasClass('half-width')

        errorElement = $('<div/>',
          id: "#{id}_error"
          class: classes
          html: message
        )

        $(errorElement).insertAfter(el)
      else
        # remove error if field becomes not empty
        nextEl = $(el).next()
        nextEl.remove() if nextEl.hasClass('validation-error')
