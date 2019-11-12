module Proposal
  class ApprovedProposalsController < ManageMetadataController
    # There are exceptions in this code for proposal_mode checks for development
    # and test to prevent the need to run two servers while using those
    # environments.

    skip_before_action :ensure_user_is_logged_in
    skip_before_action :refresh_urs_if_needed, :refresh_launchpad_if_needed, :provider_set?
    #skip_before_action :user_has_approver_permissions?

# May need this later:
#    skip_before_action :verify_authenticity_token, only: :approved_proposals


    def approved_proposals
      passed_token = request.headers['Echo-Token'].split(':')[0]

      response = cmr_client.validate_token(passed_token)
      # verify user in urs
      # check acls

      if true # replace with result of acl check
        approved_proposals = CollectionDraftProposal.publish_approved_proposals

        render json: { proposals: approved_proposals }, status: :ok
      else
        # TODO: Refine this logging message based on what results of URS endpoint and acl check are
        Rails.logger.info("#{request.uuid}: Token provided by user either was not successfully authenticated or the user was not authorized to view dMMT proposals.")
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

    def proposal_approver_permissions
      if Rails.env.development? || Rails.env.test?
        @user_has_approver_permissions = false
      else
        super
      end
    end
  end
end
