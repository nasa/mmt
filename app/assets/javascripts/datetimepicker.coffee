################################################################################
# date time pickers are used throughout our CMR search related forms (e.g. bulk#
# updates. If you are looking for the UI objects controlling the selection of  #
# dates in the draft forms, you should be look in the datepicker files (e.g.   #
# datepicker.coffee or vendor/assets/bootrap-datepicker-1.6.0                  #
################################################################################

$(document).ready ->
  defaultOptions =
    # Prevents the picker from adjusting the time displayed to
    # the users local timezone. This requires moment-timezone.js
    timeZone: 'UTC'

    # ISO 8601 format
    format: 'YYYY-MM-DD[T]HH:mm:ss[Z]'

    # Display the clear date button
    showClear: true

    # Display the close picker button
    showClose: true

    # Prevent the picker from automatically setting the date when
    # the picker is displayed and no value has been selected
    useCurrent: false

    # Because this is for bootstrap, it uses Glyphicons -- we need
    # to override it to use font awesome because we already use it
    icons:
      time: 'fa fa-clock-o'
      date: 'fa fa-calendar'
      up: 'fa fa-chevron-up'
      down: 'fa fa-chevron-down'
      previous: 'fa fa-chevron-left'
      next: 'fa fa-chevron-right'
      today: 'fa fa-calendar-check-o'
      clear: 'fa fa-trash-o'
      close: 'fa fa-close'

  $('.datetimepicker').datetimepicker($.extend(minDate: moment().startOf('day'), defaultOptions))

  $('.search-datetimepicker').datetimepicker defaultOptions

  # Initialize new search-datetimepickers after adding new search criteria fields
  $(document).on 'click', '.add-search-criteria', ->
    $('.search-datetimepicker').datetimepicker defaultOptions
