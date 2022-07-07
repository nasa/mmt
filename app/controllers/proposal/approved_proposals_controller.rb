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

        Rails.logger.info("dMMT successfully authenticated and authorized #{@urs_profile_response.body['uid']} while fetching approved proposals.")
        render json: { proposals: proposals_with_draft_types }, status: :ok
      else
        Rails.logger.info("#{request.uuid}: Attempting to authenticate Launchpad token while fetching approved proposals resulted in '#{@token_response.status}' status, and retrieving the associated URS account resulted in '#{@urs_profile_response.present? ? @urs_profile_response.status : 'no request sent because previous request failed'}'. If both the statuses returned ok, then the user's Non-NASA Draft Approver ACL check failed.")
        render json: { body: 'Requesting user could not be authorized', request_id: request.uuid }, status: :unauthorized
      end
    end

    # Endpoint for MMT to update dMMT proposal statuses.  Expects to be passed
    # params: 'draft_type' = table name and 'id' = unique identifier of a
    # proposal to update that proposal's status to done
    def update_proposal_status
      unless @requester_has_approver_permissions
        # Requester could not be authorized
        Rails.logger.info("#{request.uuid}: Attempting to authenticate Launchpad token while updating a proposal's status resulted in '#{@token_response.status}' status, and retrieving the associated URS account resulted in '#{@urs_profile_response.present? ? @urs_profile_response.status : 'no request sent because previous request failed'}'. If both the statuses returned ok, then the user's Non-NASA Draft Approver ACL check failed.")
        render json: { body: 'Requesting user could not be authorized', request_id: request.uuid }, status: :unauthorized and return
      end

      draft_type = request.params['draft_type']
      unless PROPOSAL_CLASSES.include?(draft_type)
        # This is not a type of proposal that dMMT understands
        Rails.logger.info("#{request.uuid}: Attempting to update proposal status for proposal of type: #{draft_type} with id: #{request.params['id']} failed because the draft_type is invalid.")
        render json: { body: "Proposal with id: #{request.params['id']} could not be found or altered", request_id: request.uuid }, status: :bad_request and return
      end

      proposal = draft_type.constantize.find_by(id: request.params['id'])
      unless update_and_save_done_status(proposal, @urs_profile_response.body['uid'])
        # Record either could not be found or altered.
        Rails.logger.info("#{request.uuid}: Attempting to update proposal status for proposal of type: #{draft_type} with id: #{request.params['id']} failed because the record could not be #{proposal.blank? ? 'found' : 'altered'}")
        render json: { body: "Proposal with id: #{request.params['id']} could not be found or altered", request_id: request.uuid }, status: :bad_request and return
      end

      unless proposal.destroy
        # Could not delete record.
        Rails.logger.info("Attempting to delete done proposal for proposal of type: #{draft_type} with id: #{request.params['id']} failed.")
        render json: { body: "Proposal with id: #{request.params['id']} could not be deleted, but has been marked done., ", request_id: request.uuid}, status: :bad_request and return
      end

      # Record was found, updated, and deleted
      Rails.logger.info("Audit Log: Proposal of type: #{draft_type} with id: #{request.params['id']} was successfully updated to be 'done' and deleted.")
      render json: { body: nil }, status: :ok
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
    # Expects to be passed an 'Echo-Token' of format 'LaunchpadToken' in the headers.
    def validate_token_and_user
      passed_token = request.headers.fetch('Authorization', nil)

      # Navigate a browser elsewhere if there is no token
      redirect_to root_path and return if passed_token.blank?

      @token_response = cmr_client.validate_launchpad_token(passed_token)

      if @token_response.success?
        auid = @token_response.body.fetch('auid', nil)
        @urs_profile_response = cmr_client.get_urs_uid_from_nams_auid(auid)

        if @urs_profile_response.success?
          urs_uid = @urs_profile_response.body.fetch('uid', '')
          @requester_has_approver_permissions = is_non_nasa_draft_approver?(user: User.new(urs_uid: urs_uid), token: passed_token)
        else
          Rails.logger.info "User with auid #{session[:auid]} does not have an associated URS account or the account could not be located. Cannot validate user for approved proposals: #{@urs_profile_response.clean_inspect}"

          render json: { error: "Could not locate associated URS account for user with auid #{session[:auid]}" }, status: :unauthorized
          # TODO: is this the right status to return for this scenario?
        end

      else
        Rails.logger.info "Could not authenticate Launchpad token and verify user to return approved proposals: #{@token_response.clean_inspect}"

        if @token_response.status == 401
          render json: { error: 'Launchpad token unauthorized' }, status: :unauthorized
        else
          false
        end
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
