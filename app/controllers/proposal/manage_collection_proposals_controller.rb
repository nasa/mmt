module Proposal
  class ManageCollectionProposalsController < ManageMetadataController
    skip_before_action :provider_set?

    before_action :ensure_non_nasa_draft_permissions

    def show
      authorize :manage_collection_proposal

      # If you change this number you must also change it in the corresponding test file - features/manage_collections/open_drafts_spec.rb.
      @proposal_display_max_count = 5
      @proposal_type = 'CollectionDraftProposal'

      if @user_has_approver_permissions
        @in_work_proposals =
          CollectionDraftProposal.where('proposal_status = ?', 'in_work')
                                 .order('updated_at DESC')
                                 .limit(@proposal_display_max_count + 1)
        @queued_proposals =
          CollectionDraftProposal.where('proposal_status != ?', 'in_work')
                                 .order('updated_at DESC')
                                 .limit(@proposal_display_max_count + 1)
      else
        @proposals = current_user.collection_draft_proposals
                                 .order('updated_at DESC')
                                 .limit(@proposal_display_max_count + 1)
      end
    end

    private

    def proposal_mode_enabled?
      # in regular mmt all proposal actions should be blocked
      redirect_to manage_collections_path unless Rails.configuration.proposal_mode
    end

    # Custom error messaging for Pundit
    def user_not_authorized(exception)
      clear_session_and_token_data

      redirect_to root_url, flash: { error: "It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}." }
    end
  end
end
