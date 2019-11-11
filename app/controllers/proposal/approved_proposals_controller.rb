module Proposal
  class ApprovedProposalsController < ManageMetadataController
    skip_before_action :ensure_user_is_logged_in
    skip_before_action :refresh_urs_if_needed, :refresh_launchpad_if_needed, :provider_set?
    #skip_before_action :user_has_approver_permissions?
    skip_before_action :proposal_approver_permissions
# May need this later:
#    skip_before_action :verify_authenticity_token, only: :approved_proposals


    def approved_proposals
      params = request.query_parameters
      passed_token = request.headers['Echo-Token']
      # verify user in urs
      # check acls

      approved_proposals = CollectionDraftProposal.where(proposal_status: 'approved')

      render json: approved_proposals
    end

    def proposal_mode_enabled?
      unless Rails.configuration.proposal_mode || (Rails.env.development? || Rails.env.test?)
        respond_to do |format|
          format.json { render json: { body: nil, status: 403 } }
          format.html { render 'errors/not_found', status: 403 }
        end
      end
    end
  end
end
