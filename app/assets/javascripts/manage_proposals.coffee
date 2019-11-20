$(document).ready ->
  # Change the modal on the Manage Proposals page to fit the clicked link
  $('.approver-proposal-modal-link').on 'click', (element) ->
    proposal = $(this).data('proposal')

    if proposal.request_type == 'create'
      modal_text = 'Please select a provider to publish this metadata to the CMR.'
      $('#approver-proposal-modal-yes-button').hide()
      $('#approver-proposal-modal-yes-button').val('Publish')
      $('#approver-proposal-modal-no-button').text('Cancel')
      $('#provider-publish-target').show()
    else if proposal.request_type == 'update'
      modal_text = 'Are you sure you want to update this metadata in the CMR?'
      $('#approver-proposal-modal-yes-button').show()
      $('#approver-proposal-modal-yes-button').val('Yes')
      $('#approver-proposal-modal-no-button').text('No')
      $('#provider-publish-target').hide()
    else if proposal.request_type == 'delete'
      modal_text = 'Are you sure you want to delete this metadata in the CMR?'
      $('#approver-proposal-modal-yes-button').show()
      $('#approver-proposal-modal-yes-button').val('Yes')
      $('#approver-proposal-modal-no-button').text('No')
      $('#provider-publish-target').hide()

    $('#approver-proposal-modal-question-text').text(modal_text)
    $('#proposal_data').val(JSON.stringify(proposal))

  $('#provider-publish-target').on 'change', (element) ->
    if $(this).find(':selected').text() != 'Select a provider to publish this record'
      $('#approver-proposal-modal-yes-button').show()
    else
      $('#approver-proposal-modal-yes-button').hide()
