module Proposal
  class CollectionDraftProposalsController < CollectionDraftsController
    skip_before_action :provider_set?

    def publish
      authorize get_resource

      flash[:error] = 'Collection Draft Proposal cannot be published.'
      redirect_to manage_collection_proposals_path
    end

    def destroy
      # According to the documentation, only "In Work" proposals should be deletable
      # "Rejected" and "Submitted" can be rescinded to "In Work" to be deleted.
      # "Approved" and "Done" can be neither rescinded nor deleted.
      unless get_resource&.in_work?
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.destroy.flash.error") + '. Only proposals in an "In Work" status can be deleted.'
        redirect_to collection_draft_proposal_path(get_resource) and return
      end
      super
    end

    private

    def set_resource_by_model
      # Doing this way because don't want provider id being sent
      set_resource(CollectionDraftProposal.new(user: current_user, draft: {}))
    end

    def proposal_mode_enabled?
      # in regular mmt all proposal actions should be blocked
      redirect_to manage_collections_path unless Rails.configuration.proposal_mode
    end
  end
end
