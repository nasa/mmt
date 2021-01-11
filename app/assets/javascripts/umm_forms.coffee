$(document).ready ->

  if $('.umm-form').length > 0

    $('.dependent-fields-checkbox').on 'change', ->
      fieldClass = $(this).data('dependentFieldClass')
      dependentFields = $(this).siblings(".#{fieldClass}-fields")
      if this.checked
        $(dependentFields).removeClass('is-hidden')
      else
        # clear field values
        $.each $(dependentFields).find('input, select').not("input[type='radio']"), (index, field) ->
          $(field).val('')
        $.each $(dependentFields).find("input[type='radio'], input[type='checkbox']"), (index, field) ->
          $(field).prop('checked', false)
        # remove required labels
        $(dependentFields).find('label').removeClass('eui-required-o')
        # hide any nested checkbox dependent fields
        $(dependentFields).find('.checkbox-dependent-fields').addClass('is-hidden')
        $(dependentFields).addClass('is-hidden')
