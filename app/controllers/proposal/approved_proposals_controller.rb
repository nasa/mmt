module Proposal
  class ApprovedProposalsController < ManageMetadataController
    def approved_proposals
      # find token in header
      # verify user in urs
      # get user id from urs
      # check acls

      @approved_proposals = CollectionDraftProposal.where(proposal_status: 'approved')

      render(json { @approved_proposals })
    end

    private

    #need to define this or skip it
    def user_has_approver_permissions?

    end
  end
end
