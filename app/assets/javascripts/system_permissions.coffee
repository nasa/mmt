# TODO: delete file

$(document).ready ->
  if $('.system-permissions-form').length > 0 && $('.system-permissions-table').length > 0

    availablePermissions = $('.system-permissions-table').find('input[type=checkbox]').not('[disabled]')
    $checkAllBox = $('#system_acls_select_all')

    # on load, if all availablePermissions are checked, the check all box should be checked
    if $('.system-permissions-table').find('input[type=checkbox]:checked').length == availablePermissions.length
      $checkAllBox.prop('checked', true)

    $checkAllBox.on 'change', ->
      # check or uncheck all available permissions
      if $(this).is(':checked')
        availablePermissions.prop('checked', true)
      else
        availablePermissions.prop('checked', false)
