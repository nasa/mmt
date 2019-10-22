module Proposal
  class ManageCollectionProposalsController < ManageMetadataController
    skip_before_action :provider_set?

    before_action :ensure_non_nasa_draft_permissions

    def show
      authorize CollectionDraftProposal, policy_class: CollectionDraftProposalPolicy

      # If you change this number you must also change it in the corresponding test file - features/manage_collections/open_drafts_spec.rb.
      @draft_proposal_display_max_count = 5

      @collection_draft_proposals =
        CollectionDraftProposal.order('updated_at DESC')
                               .limit(@draft_proposal_display_max_count + 1)
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
