$(document).ready ->

  # Check All/None functionality
  $('.checkall').change (event) ->
    $('input[name="' + $(this).data('group') + '"]').prop('checked', $(this).prop("checked"))

  # Check All/None functionality for system and provider object permissions tables
  if $('.permissions-management-table').length > 0

    availablePermissions = $('.permissions-management-table').find('input[type=checkbox]').not('[disabled]')
    $permCheckallBox = $('.permissions-management-checkall')

    # on load, if all availablePermissions are checked, the checkall box should be checked
    if $('.permissions-management-table').find('input[type=checkbox]:checked').length == availablePermissions.length
      $permCheckallBox.prop('checked', true)

    $permCheckallBox.on 'change', ->
      # check or uncheck all available permissions
      availablePermissions.prop('checked', $(this).prop("checked"))
