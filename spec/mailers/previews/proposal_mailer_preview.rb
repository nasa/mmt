# Preview emails at http://localhost:3000/rails/mailers/proposal_mailer
class ProposalMailerPreview < ActionMailer::Preview
  def new_proposal_submitted_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    short_name = 'CIESIN_SEDAC_EPI_2010'
    version = 2010
    id = 1

    ProposalMailer.proposal_submitted_notification(user, short_name, version, id)
  end
end
