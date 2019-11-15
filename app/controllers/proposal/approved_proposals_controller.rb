module Proposal
  class ApprovedProposalsController < ManageMetadataController
    # There are exceptions in this code for proposal_mode checks for development
    # and test to prevent the need to run two servers while using those
    # environments.

    skip_before_action :ensure_user_is_logged_in
    skip_before_action :refresh_urs_if_needed, :refresh_launchpad_if_needed, :provider_set?, :proposal_approver_permissions

    def approved_proposals
      passed_token = request.headers.fetch('Echo-Token', ':').split(':')[0]

      # Navigate a browser elsewhere.
      redirect_to root_path and return if passed_token.blank?

      token_response = cmr_client.validate_token(passed_token)

      if token_response.success?
        authenticated_user = User.new(urs_uid: token_response.body['uid'])
        requester_has_approver_permissions = is_non_nasa_draft_approver?(user: authenticated_user, token: passed_token)
      else
        requester_has_approver_permissions = false
      end

      if requester_has_approver_permissions
        approved_proposals = CollectionDraftProposal.publish_approved_proposals

        Rails.logger.info("dMMT successfully authenticated and authorized #{authenticated_user.urs_uid} while fetching approved proposals.")
        render json: { proposals: approved_proposals }, status: :ok
      else
        Rails.logger.info("#{request.uuid}: Attempting to authenticate token resulted in '#{token_response.status}' status. If the status returned ok, then the user's Non-NASA Draft Approver ACL check failed.")
        render json: { body: 'Requesting user could not be authorized', request_id: request.uuid }, status: :unauthorized
      end
    end

    def proposal_mode_enabled?
      unless Rails.configuration.proposal_mode || (Rails.env.development? || Rails.env.test?)
        respond_to do |format|
          format.json { render json: { body: nil }, status: :forbidden }
          format.html { redirect_to manage_collections_path }
        end
      end
    end
  end
end
