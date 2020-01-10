# Preview emails at http://localhost:3000/rails/mailers/proposal_mailer
class ProposalMailerPreview < ActionMailer::Preview
  def new_proposal_submitted_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    short_name = 'CIESIN_SEDAC_EPI_2010'
    version = 2010
    id = 1

    ProposalMailer.proposal_submitted_notification(user, short_name, version, id)
  end

  def new_proposal_approved_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    short_name = 'CIESIN_SEDAC_EPI_2010'
    version = 2010
    id = 1

    ProposalMailer.proposal_approved_notification(user, short_name, version, id)
  end

  def new_proposal_published_delete_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    cmr_response_body = { 'concept-id' => 'C1200000007-SEDAC', 'revision-id' => 1 }
    proposal = { 'draft' => { 'ShortName' => 'CIESIN_SEDAC_EPI_2010', 'Version' => 2010 }, 'request_type' => 'delete' }

    ProposalMailer.proposal_published_notification(user, cmr_response_body, proposal)
  end

  def new_proposal_published_create_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    cmr_response_body = { 'concept-id' => 'C1200000007-SEDAC', 'revision-id' => 1 }
    proposal = { 'draft' => { 'ShortName' => 'CIESIN_SEDAC_EPI_2010', 'Version' => 2010 }, 'request_type' => 'create' }

    ProposalMailer.proposal_published_notification(user, cmr_response_body, proposal)
  end
end
