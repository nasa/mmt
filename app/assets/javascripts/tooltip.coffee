#
# This code uses jquery-ui to replace the built in tooltip popup with a nicer
# one. The popup can be styled but by default is slightly larger and pops up
# faster. The tooltip function only needs to be called once as it searches
# the DOM attaching the new UI to any tag with a defined tooltip.
#

$(document).ready ->
  unless $("#bulk-updates-form").length > 0
    # dont show the tooltips on the bulk update forms as it just looks weird
    # and messes up the tests

    if $('.Chooser').length > 0
      $('.Chooser').tooltip(
        content: () ->
          title = $(this).prop('title')
          element = $.parseHTML(title)

          titleHasNoUnexpectedHtml = element.every (item) -> /^(B|BR|#text)$/.test item.nodeName

          if titleHasNoUnexpectedHtml then title else $.text(element)

        items: 'option.icon-s3'
      )

    $(document).tooltip()
