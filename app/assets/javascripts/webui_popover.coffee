$(document).ready ->
  $('.webui-popover-link').webuiPopover(
    {
      animation: 'fade',
      placement: 'right',
      width: '250' # Set to accommodate longest role for data centers and data contacts
    })
