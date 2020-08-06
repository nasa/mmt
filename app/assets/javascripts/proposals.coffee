$(document).ready ->

  if $('#reject-submission-modal').length > 0
    # attach select2 to the modal for rejecting a proposal
    $('.proposal-reject-select2').select2
      dropdownParent: $('#reject-submission-modal')
      width: '100%'