################################################################################
# date pickers are used throughout our draft forms (e.g. temporal information) #
# if you are looking for the UI objects controlling the selection of dates in  #
# the CMR search related fields (e.g. bulk updates), you should look in the    #
# datetimepicker files (e.g. datetimepicker.coffee)                            #
################################################################################

$(document).ready ->
  $('.metadata-form').on 'focus', 'input[type="custom-datetime"]', ->
    pickerOpts =
      startView: 2
      format: 'yyyy-mm-dd'
      todayBtn: 'linked'
      clearBtn: true
      autoclose: true
      todayHighlight: true
      forceParse: false
      keyboardNavigation: false
    $(this).datepicker(pickerOpts).one 'hide', (e) ->
      $(document).trigger 'mmtValidate'
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
