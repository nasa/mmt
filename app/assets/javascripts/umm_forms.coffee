$(document).ready ->

  if $('.umm-form').length > 0

    $('.dependent-fields-checkbox').on 'change', ->
      fieldClass = $(this).data('dependentFieldClass')
      dependentFields = $(this).closest('.checkbox-dependent-fields-parent').find(".#{fieldClass}-fields")
      if $(this).prop('checked') == true
        $(dependentFields).removeClass('is-hidden')

      else if $(this).prop('checked') == false
        # clear field values
        $.each $(dependentFields).find('input, select').not("input[type='radio']"), (index, field) ->
          $(field).val('')
        $.each $(dependentFields).find("input[type='radio'], input[type='checkbox']"), (index, field) ->
          $(field).prop('checked', false)
        # remove required labels
        $(dependentFields).find('label').removeClass('eui-required-o')

        $(dependentFields).addClass('is-hidden')
