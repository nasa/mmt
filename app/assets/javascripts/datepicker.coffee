$(document).ready ->
  $('body').on 'focus', 'input[type="datetime"]', ->
    pickerOpts =
      startView: 2
      format: 'yyyy-mm-dd'
      todayBtn: 'linked'
      clearBtn: true
      autoclose: true
      todayHighlight: true
      forceParse: false
      keyboardNavigation: false
    $(this).datepicker(pickerOpts)
    .one 'hide', (e) ->
      $(this).datepicker('remove')
      e.stopImmediatePropagation()

$.extend $.fn.datepicker.DPGlobal,
  formatDate: (date, format, language) ->
    if !date
      return ''

    if format == 'yyyy-mm-dd'
      # Display the correct format with time in the input field
      date.toISOString()
    else if format == 'MM yyyy'
      # Display 'November 2015' when viewing the month instead of the ISOString
      dates = $.fn.datepicker.dates
      "#{dates[language].months[date.getUTCMonth()]} #{date.getUTCFullYear()}"
