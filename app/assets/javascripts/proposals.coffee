$(document).ready ->

  if $('#reject-submission-modal').length > 0
    # attach select2 to the modal for rejecting a proposal
    $('.proposal-reject-select2').select2
      dropdownParent: $('#reject-submission-modal')
      width: '100%'
    .on 'select2:close', (e) ->
      # validate or revalidate on close
      $(this).valid()


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
          required: true
        'rejection[note]':
          required: true
      messages:
        'rejection[reasons][]':
          required: 'Reason(s) are required'
        'rejection[note]':
          required: 'Note is required'
