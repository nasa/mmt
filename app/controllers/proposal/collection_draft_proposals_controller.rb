module Proposal
  class CollectionDraftProposalsController < CollectionDraftsController

    def publish
      flash[:error] = 'Collection Draft Proposal cannot be published.'
      redirect_to manage_collections_path
    end

    private

    def set_resource_by_model
      # Doing this way because don't want provider id being sent
      set_resource(CollectionDraftProposal.new(user: current_user, draft: {}))
    end

    def collection_draft_proposal_enabled?
      # in regular mmt all proposal actions should be blocked
      redirect_to manage_collections_path unless Rails.configuration.is_draft_only
    end
  end
end