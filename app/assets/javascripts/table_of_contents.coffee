###
Find all accordions on the additional information panel and create a table of
contents out of them. Also create a button for "Table of Contents" and have it 
show/hide the table.
###

createTableOfContentsFromAccordians = (tag) ->
  accordianPanel = $('#' + tag + '-panel')
  if accordianPanel.length > 0
    toc_identifier = tag + '-toc'
    accordianPanel.prepend $('<div/>', id: toc_identifier)
    toc = $('#' + toc_identifier)
    toc.append $('<button>',
      type: 'button'
      class: 'eui-btn--blue eui-btn--round eui-btn--lg'
      title: 'Show/Hide Table of Contents'
      text: 'Table of Contents')
    toc.append '<ul>'
    $('.eui-accordion__title').each () ->
      topic = $(this).text().replace(/[^\w]/g, ' ')
      topic_name = topic.replace(/\s/g, '_')
      $(this).parent().prepend $('<a/>', name: topic_name)
      link = $('<a>',
        href: '#' + topic_name
        title: 'Jump to ' + topic
        text: topic)
      toc.children('ul').append $('<li>').append(link)
    $('#' + toc_identifier + ' > button').click ->
      $(this).next().toggle 'slow'

$(document).ready ->
  createTableOfContentsFromAccordians 'additional-information'

