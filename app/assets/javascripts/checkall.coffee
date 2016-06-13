$(document).ready ->

  # Check All/None functionality
  $('.checkall').change (event) ->
    $('input[name="' + $(this).data('group') + '"').prop('checked', $(this).prop("checked"));
