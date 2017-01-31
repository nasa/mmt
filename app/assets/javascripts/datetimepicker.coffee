$(document).ready ->
  datetimepickerDefaults =
    # Prevents the picker from adjusting the time displayed to
    # the users local timezone. This requires moment-timezone.js
    timeZone: 'UTC'

    # ISO 8601 format
    format: 'YYYY-MM-DD[T]HH:mm:ss[Z]'

    # Sets the minimum date to the start of today
    minDate: moment().startOf('day')

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

  $('.track-orders-form .datetimepicker').datetimepicker(
    Object.assign({}, datetimepickerDefaults, format: 'YYYY-MM-DD[T]HH:mm:ss', minDate: false))

  $('.datetimepicker').datetimepicker(datetimepickerDefaults)
