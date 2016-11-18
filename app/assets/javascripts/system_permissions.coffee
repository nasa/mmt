$(document).ready ->
  if $('.system-permissions-form').length > 0

    $('#system_acls_select_all').on 'change', ->
      availablePermissions = $('.system-permissions-table').find('input[type="checkbox"]').not('[readonly]')

      if $(this).is(':checked')
        availablePermissions.prop('checked', true)
      else
        availablePermissions.prop('checked', false)
