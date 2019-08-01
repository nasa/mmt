module Proposal
  class CollectionDraftProposalsController < CollectionDraftsController

    def publish
    end

    private

    def set_new_resource
      set_resource(CollectionDraftProposal.new(user: current_user, draft: {}))
    end

    def collection_draft_proposal_enabled?
      # in regular mmt all proposal actions should be blocked
      redirect_to manage_collections_path unless Rails.configuration.is_draft_only
    end
  end
end