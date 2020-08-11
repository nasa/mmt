# Preview emails at http://localhost:3000/rails/mailers/proposal_mailer
class ProposalMailerPreview < ActionMailer::Preview
  def new_proposal_submitted_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    short_name = 'CIESIN_SEDAC_EPI_2010'
    version = 2010
    id = 1
    request_type = 'create'

    ProposalMailer.proposal_submitted_notification(user, short_name, version, id, request_type)
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
    request_type = 'create'

    ProposalMailer.proposal_approved_notification(user, short_name, version, id, request_type)
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

  def new_proposal_rejected_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    proposal = CollectionDraftProposal.new
    proposal.draft = { 'ShortName' => 'CIESIN_SEDAC_EPI_2010', 'Version' => '2010' }
    # Every possible reason and a long note to show a 'worst case scenario' kind of e-mail
    proposal.approver_feedback =
      {
        'reasons' => ['Missing Keywords', 'Insufficient Content', 'Misspellings/Grammar', 'Invalid/Incorrect Content', 'Broken Links', 'Duplicate Metadata', 'Other'],
        'note' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam ut porttitor leo a diam. Ornare aenean euismod elementum nisi quis eleifend quam adipiscing. Praesent elementum facilisis leo vel fringilla. Nisl condimentum id venenatis a. Proin libero nunc consequat interdum varius sit. Est ullamcorper eget nulla facilisi etiam dignissim diam quis. Aliquet bibendum enim facilisis gravida neque convallis. Pellentesque adipiscing commodo elit at imperdiet dui accumsan sit amet. Egestas purus viverra accumsan in nisl nisi. Purus in mollis nunc sed id semper risus. Quis blandit turpis cursus in hac habitasse platea dictumst. Pellentesque elit eget gravida cum sociis natoque penatibus et.

        Egestas congue quisque egestas diam. Libero volutpat sed cras ornare arcu dui vivamus arcu. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Varius duis at consectetur lorem donec massa sapien faucibus. Dolor purus non enim praesent. Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Consectetur lorem donec massa sapien. Sed arcu non odio euismod lacinia at quis risus sed. Semper quis lectus nulla at. Elementum nisi quis eleifend quam adipiscing vitae proin sagittis. In ante metus dictum at tempor commodo. Venenatis a condimentum vitae sapien pellentesque. Eu nisl nunc mi ipsum faucibus. Lorem sed risus ultricies tristique nulla aliquet enim. Nulla pharetra diam sit amet nisl.

        Eget gravida cum sociis natoque penatibus et. Blandit turpis cursus in hac habitasse platea dictumst quisque. Curabitur gravida arcu ac tortor dignissim convallis aenean et tortor. Convallis a cras semper auctor neque. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla. At in tellus integer feugiat scelerisque varius morbi enim nunc. Leo vel fringilla est ullamcorper eget nulla facilisi etiam dignissim. Malesuada fames ac turpis egestas sed. Nunc scelerisque viverra mauris in aliquam sem fringilla. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Mauris sit amet massa vitae tortor. Vitae et leo duis ut diam. Donec ac odio tempor orci dapibus ultrices in iaculis. Amet consectetur adipiscing elit duis tristique sollicitudin. Magna eget est lorem ipsum dolor.'
      }

    proposal.request_type = 'create'
    proposal.id = 1

    ProposalMailer.proposal_rejected_notification(user, proposal)
  end

  def new_proposal_rejected_without_feedback_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    proposal = CollectionDraftProposal.new
    proposal.draft = { 'ShortName' => 'CIESIN_SEDAC_EPI_2010', 'Version' => '2010' }
    # Every possible reason and a long note to show a 'worst case scenario' kind of e-mail
    proposal.approver_feedback = {}

    proposal.request_type = 'create'
    proposal.id = 1

    ProposalMailer.proposal_rejected_notification(user, proposal)
  end
end
