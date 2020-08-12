$(document).ready ->

  if $('#reject-submission-modal').length > 0
    # attach select2 to the modal for rejecting a proposal
    $('.proposal-reject-select2').select2
      dropdownParent: $('#reject-submission-modal')
      width: '100%'
    .on 'select2:close', (e) ->
      # validate or revalidate on close
      $(this).valid()

    $('#rejection_note').change ->
      if $('#rejection_note').val()
        $('#proposal-rejection-reasons').addClass('required')
      else
        $('#proposal-rejection-reasons').removeClass('required')
      updateRequiredIcons()
        
    $('#proposal-rejection-reasons').change ->
      updateRequiredIcons()

    # validate rejection feedback
    $('.reject-proposal-form').validate
      errorPlacement: (error, element) ->
        if element.attr('id') == 'proposal-rejection-reasons'
          # select2 inputs end up with various classes and extra elements
          $actualInput = $('.select2-container.select2-container--default')
          error.insertAfter($actualInput)
        else
          error.insertAfter(element)
      rules:
        'rejection[reasons]':
          required:
            depends:
              -> $('#rejection-note').val().length > 0
        'rejection[note]':
          required: 
            depends:
              -> $('#proposal-rejection-reasons').val().length > 0
      messages:
        'rejection[reasons][]':
          required: 'Reason(s) are required'
        'rejection[note]':
          required: 'Note is required'
          
    updateRequiredIcons = -> 
      if $('#rejection_note').val() || $('#proposal-rejection-reasons').val().length > 0
        $('label[for=rejection_reasons]').addClass('eui-required-o')
        $('label[for=rejection_note]').addClass('eui-required-o')
      else
        $('label[for=rejection_reasons]').removeClass('eui-required-o')
        $('label[for=rejection_note]').removeClass('eui-required-o')
      $('.reject-proposal-form').valid()
