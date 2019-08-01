module Proposal
  class ManageCollectionProposalsController < ManageMetadataController
    #before_action :collection_draft_proposal_enabled?

    def show
      # TODO: change the directory name for the tests
      # If you change this number you must also change it in the corresponding test file - features/manage_collections/open_drafts_spec.rb.
      @draft_proposal_display_max_count = 5

      @collection_draft_proposals = CollectionDraftProposal.order('updated_at DESC')
                   .limit(@draft_proposal_display_max_count + 1)
      # @drafts = policy_scope(CollectionDraft).order('updated_at DESC')
      #             .limit(@draft_display_max_count + 1)
    end

    private

    def collection_draft_proposal_enabled?
      # in regular mmt all proposal actions should be blocked
      redirect_to manage_collections_path unless Rails.configuration.is_draft_only
    end
  end
end