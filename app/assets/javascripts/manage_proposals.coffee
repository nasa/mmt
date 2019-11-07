$(document).ready ->
  # Change the modal on the Manage Proposals page to fit the clicked link
  $('.approver-proposal-modal-link').on 'click', (element) ->
    proposal = $(this).data('proposal')

    if proposal.request_type == 'create'
      modal_text = 'Please select a provider to publish this metadata to the CMR.'
      $('#approver-proposal-modal-yes-button').hide()
      $('#approver-proposal-modal-yes-button').text('Publish')
      $('#approver-proposal-modal-no-button').text('Cancel')
    else if proposal.request_type == 'update'
      modal_text = 'Are you sure you want to update this metadata in the CMR?'
      $('#approver-proposal-modal-yes-button').show()
      $('#approver-proposal-modal-yes-button').text('Yes')
      $('#approver-proposal-modal-no-button').text('No')
    else if proposal.request_type == 'delete'
      modal_text = 'Are you sure you want to delete this metadata in the CMR?'
      $('#approver-proposal-modal-yes-button').show()
      $('#approver-proposal-modal-yes-button').text('Yes')
      $('#approver-proposal-modal-no-button').text('No')

    $('#approver-proposal-modal-question-text').text(modal_text)
    # TODO: will also need to manipulate whatever needs to be changed to get
    # the proposal published
