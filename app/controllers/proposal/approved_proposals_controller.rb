module Proposal
  class ApprovedProposalsController < ManageMetadataController
    # There are exceptions in this code for proposal_mode checks for development
    # and test to prevent the need to run two servers while using those
    # environments.

    skip_before_action :ensure_user_is_logged_in
    skip_before_action :refresh_urs_if_needed, :refresh_launchpad_if_needed, :provider_set?, :proposal_approver_permissions
    before_action :validate_token_and_user

    PROPOSAL_CLASSES = %w[CollectionDraftProposal].freeze

    def approved_proposals
      if @requester_has_approver_permissions
        approved_proposals = CollectionDraftProposal.publish_approved_proposals

        # Necessary because the .to_json call clobbers the draft_type field in
        # each record, but we need that field to identify what kind of proposal
        # we are processing.
        proposals_with_draft_types = approved_proposals.as_json
        proposals_with_draft_types.each_with_index do |record, index|
          record['draft_type'] = approved_proposals[index]['draft_type']
        end

        Rails.logger.info("dMMT successfully authenticated and authorized #{@token_response.body['uid']} while fetching approved proposals.")
        render json: { proposals: proposals_with_draft_types }, status: :ok
      else
        Rails.logger.info("#{request.uuid}: Attempting to authenticate token while fetching approved proposals resulted in '#{@token_response.status}' status. If the status returned ok, then the user's Non-NASA Draft Approver ACL check failed.")
        render json: { body: 'Requesting user could not be authorized', request_id: request.uuid }, status: :unauthorized
      end
    end

    # Endpoint for MMT to update dMMT proposal statuses.  Expects to be passed
    # params: 'draft_type' = table name and 'id' = unique identifier of a
    # proposal to update that proposal's status to done
    def update_proposal_status
      if @requester_has_approver_permissions
        draft_type = request.params['draft_type']
        if PROPOSAL_CLASSES.include?(draft_type)
          # Look for the specified record, if the draft_type is an expected type
          proposal = draft_type.constantize.find_by(id: request.params['id'])
          if update_and_save_done_status(proposal, @token_response.body['uid'])
            # Record was found and altered
            Rails.logger.info("Audit Log: Proposal of type: #{draft_type} with id: #{request.params['id']} was successfully updated to be 'done'.")
            render json: { body: nil }, status: :ok
          else
            # Record either could not be found or altered.
            Rails.logger.info("#{request.uuid}: Attempting to update proposal status for proposal of type: #{draft_type} with id: #{request.params['id']} failed because the record could not be #{proposal.blank? ? 'found' : 'altered'}")
            render json: { body: "Proposal with id: #{request.params['id']} could not be found or altered", request_id: request.uuid }, status: :bad_request
          end
        else
          # This is not a type of proposal that dMMT understands
          Rails.logger.info("#{request.uuid}: Attempting to update proposal status for proposal of type: #{draft_type} with id: #{request.params['id']} failed because the draft_type is invalid.")
          render json: { body: "Proposal with id: #{request.params['id']} could not be found or altered", request_id: request.uuid }, status: :bad_request
        end
      else
        # Requester could not be authorized
        Rails.logger.info("#{request.uuid}: Attempting to authenticate token while updating a proposal's status resulted in '#{@token_response.status}' status. If the status returned ok, then the user's Non-NASA Draft Approver ACL check failed.")
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

    private

    # Action called before endpoints to validate a token and authorize a user
    # Expects to be passed an 'Echo-Token' of format 'URS token:URS client id'
    # in the headers.
    def validate_token_and_user
      passed_token, passed_client_id = request.headers.fetch('Echo-Token', ':').split(':')

      # Navigate a browser elsewhere if there is no token
      redirect_to root_path and return if passed_token.blank?

      @token_response = cmr_client.validate_token(passed_token, passed_client_id)

      @requester_has_approver_permissions = if @token_response.success?
                                              is_non_nasa_draft_approver?(user: User.new(urs_uid: @token_response.body['uid']), token: passed_token)
                                            else
                                              false
                                            end
    end

    def update_and_save_done_status(proposal, urs_uid)
      urs_response = cmr_client.get_urs_users([urs_uid])
      return false unless urs_response.success?
      user = urs_response.body['users'][0]
      if Rails.env.development? || Rails.env.test?
        # In the dev and test environments, the server is not in proposal mode,
        # so it cannot save records or use the existing helper methods
        # The update_column calls bypass the validations, so the changes can be
        # made
        status_change_success = if proposal.proposal_status == 'approved'
                                  proposal.update_column('proposal_status', 'done')
                                else
                                  false
                                end
        if status_change_success
          status_history = proposal.status_history
          status_history['done'] = { 'username' => "#{user['first_name']} #{user['last_name']}", 'action_date' => Time.now }
          proposal.update_column('status_history', status_history)
          proposal.update_column('updated_at', Time.now)
        end
        status_change_success
      else
        proposal&.change_status_to_done("#{user['first_name']} #{user['last_name']}")
      end
    end
  end
end
