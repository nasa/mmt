# Preview emails at http://localhost:3000/rails/mailers/proposal_mailer
class ProposalMailerPreview < ActionMailer::Preview
  def new_proposal_submitted_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    short_name = 'CIESIN_SEDAC_EPI_2010'
    version = 2010
    id = 1

    ProposalMailer.proposal_submitted_notification(user, short_name, version, id)
  end

  def new_proposal_submitted_approvers_notification
    proposal = CollectionDraftProposal.new
    proposal.id = 1
    proposal.draft = { 'ShortName': 'CIESIN_SEDAC_EPI_2010', 'Version': '2010' }
    proposal.request_type = 'create'
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    approver = { name: 'Clark Kent', email: 'supergreen@bluemarble.com' }

    ProposalMailer.proposal_submitted_approvers_notification(approver, proposal, user)
  end

  def new_proposal_approved_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    short_name = 'CIESIN_SEDAC_EPI_2010'
    version = 2010
    id = 1

    ProposalMailer.proposal_approved_notification(user, short_name, version, id)
  end
end
