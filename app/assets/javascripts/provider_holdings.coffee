$(document).ready ->
  # Don't enable filtering if there are no collections
  if($('#provider-holdings tbody tr:first td').length > 1)
    $('#provider-holdings').tablesorter
      sortList: [[0,0]]
      headers:
        2:
          sorter: 'text'

      widgets: ['zebra', 'filter']
      widthFixed: true
      widgetOptions:
        filter_reset: '.reset-filters'