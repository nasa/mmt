class ManageProposalController < ManageMetadataController
  include ProposalIndex

  before_action :mmt_approver_workflow_enabled?
  before_action :user_has_approver_permissions?

  RESULTS_PER_PAGE = 25

  def show
    @ingest_errors = params['ingest_errors']
    @specified_url = 'manage_proposals'
    @providers = ['Select a provider to publish this record'] + current_user.available_providers

    # as of MMT-2750, Launchpad should be the ONLY login method for managing proposals
    if session[:auid].blank? || session[:launchpad_cookie].blank?
      @proposals = []
      flash[:error] = 'Please log in with Launchpad to perform proposal approver actions in MMT.'
      return
    end

    sort_key, sort_dir = index_sort_order
    dmmt_response = if Rails.env.test?
                      cmr_client.dmmt_get_approved_proposals(token, request)
                    else
                      cmr_client.dmmt_get_approved_proposals(token)
                    end

    puts("******** francell dmmt response = #{dmmt_response.body} proposals=#{dmmt_response.body['proposals']}")

    if dmmt_response.success?
      Rails.logger.info("MMT successfully received approved proposals from dMMT at #{current_user.urs_uid}'s request.")

      set_urs_user_hash(dmmt_response.body['proposals'])
      proposals = if sort_key == 'submitter_id'
                    sort_by_submitter(dmmt_response.body['proposals'], @urs_user_hash)
                  elsif sort_dir == 'ASC'
                    dmmt_response.body['proposals'].sort { |a, b| a[sort_key] <=> b[sort_key] }
                  else
                    dmmt_response.body['proposals'].sort { |a, b| b[sort_key] <=> a[sort_key] }
                  end
    else
      if unauthorized?(dmmt_response)
        flash[:error] = "Your token could not be authorized. Please try refreshing the page before contacting #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')} about #{request.uuid}."
        Rails.logger.error("#{request.uuid}: A user who was logged in with Non-NASA draft approver privileges was not authenticated or authorized correctly.  Refer to dMMT logs for further information: #{dmmt_response.body['request_id']}")
      else
        flash[:error] = "An internal error has occurred. Please contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')} about #{request.uuid} for further assitance."
        Rails.logger.error("#{request.uuid}: MMT has a bug or dMMT is not configured correctly.  Request to dMMT returned https code: #{dmmt_response.status}")
      end
      proposals = []
    end
    @proposals = Kaminari.paginate_array(proposals, total_count: proposals.count).page(params.fetch('page', 1)).per(RESULTS_PER_PAGE)
  end

  def publish_proposal
    proposal = JSON.parse(params['proposal_data'])

    proposal_with_dates = CollectionDraftProposal.new(draft: proposal['draft'])
    proposal_with_dates.add_metadata_dates
    proposal['draft'] = proposal_with_dates.draft

    # Delete and update requests should have the provider_id populated already
    provider = if proposal['request_type'] == 'create'
                 params['provider-publish-target']
               else
                 proposal['provider_id']
               end

    # Update and create requests are ingested on the same end point
    if proposal['request_type'] == 'delete'
      publish_delete_proposal(proposal, provider)
    else
      publish_create_or_update_proposal(proposal, provider)
    end

    redirect_to manage_proposals_path(ingest_errors: @ingest_errors)
  end

  private

  def index_sort_order
    @query = {}
    @query['sort_key'] = params['sort_key'] unless params['sort_key'].blank?

    if @query['sort_key']&.starts_with?('-')
      [@query['sort_key'].delete_prefix('-'), 'DESC']
    elsif @query['sort_key'].present?
      [@query['sort_key'], 'ASC']
    else
      ['updated_at', 'DESC']
    end
  end

  def user_has_approver_permissions?
    redirect_to manage_collections_path unless @user_has_approver_permissions
  end

  def unauthorized?(response)
    response.status == 401
  end

  def publish_delete_proposal(proposal, provider)
    search_response = cmr_client.get_collections({ native_id: proposal['native_id'], provider_id: provider, include_granule_counts: true }, token)

    if search_response.body['hits'].to_s != '1'
      # If the search has more than one hit or 0 hits, the record was not
      # uniquely identified from it's native ID.
      flash[:error] = I18n.t('controllers.manage_proposal.publish_proposal.flash.delete.not_found_error')
      Rails.logger.info("Could not complete delete request from proposal with short name: #{proposal['short_name']} and id: #{proposal['id']} because it could not be located.")
    elsif !search_response.body['items'][0]['meta']['granule-count'].zero?
      # Do not allow the deletion of collections which have granules
      flash[:error] = I18n.t('controllers.manage_proposal.publish_proposal.flash.delete.granules_error')
      Rails.logger.info("Could not complete delete request from proposal with short name: #{proposal['short_name']} and id: #{proposal['id']} because it had granules at the time of the delete attempt.")
    else
      cmr_response = cmr_client.delete_collection(provider, proposal['native_id'], token)

      if cmr_response.success?
        flash[:success] = I18n.t('controllers.manage_proposal.publish_proposal.flash.delete.success')
        Rails.logger.info("Audit Log: Collection with native_id #{proposal['native_id']} was deleted for #{provider} by #{session[:urs_uid]} by proposal with short name: #{proposal['short_name']} and id: #{proposal['id']}.")

        submitter_from_proposal_response = submitter_from_proposal(proposal)
        # Submitter email
        ProposalMailer.proposal_published_notification(submitter_from_proposal_response, cmr_response.body, proposal).deliver_now if submitter_from_proposal_response
        # Approver email
        ProposalMailer.proposal_published_notification(get_user_info, cmr_response.body, proposal).deliver_now
        update_proposal_status_in_dmmt(proposal)
      else
        flash[:error] = I18n.t('controllers.manage_proposal.publish_proposal.flash.delete.error')
        @ingest_errors = generate_ingest_errors(cmr_response)
        Rails.logger.info("User: #{current_user.urs_uid} could not delete a collection with native_id #{proposal['native_id']} based on proposal with short name: #{proposal['short_name']} and id: #{proposal['id']}")
        Rails.logger.error("Delete collection from proposal error: #{cmr_response.clean_inspect}")
      end
    end
  end

  def publish_create_or_update_proposal(proposal, provider)
    cmr_response = cmr_client.ingest_collection(proposal['draft'].to_json, provider, proposal['native_id'], token)

    if cmr_response.success?
      flash[:success] = I18n.t('controllers.manage_proposal.publish_proposal.flash.create.success')
      Rails.logger.info("Audit Log: #{proposal['request_type'].titleize} Proposal #{proposal['entry_title']} was published by #{current_user.urs_uid} in provider: #{provider} by proposal with short name: #{proposal['short_name']} and id: #{proposal['id']}")

      submitter_from_proposal_response = submitter_from_proposal(proposal)
      # Submitter email
      ProposalMailer.proposal_published_notification(submitter_from_proposal_response, cmr_response.body, proposal).deliver_now if submitter_from_proposal_response
      # Approver email
      ProposalMailer.proposal_published_notification(get_user_info, cmr_response.body, proposal).deliver_now
      update_proposal_status_in_dmmt(proposal)
    else
      flash[:error] = I18n.t('controllers.manage_proposal.publish_proposal.flash.create.error')
      @ingest_errors = generate_ingest_errors(cmr_response)
      Rails.logger.info("User: #{current_user.urs_uid} could not publish proposal with short name: #{proposal['short_name']} and id: #{proposal['id']} in the CMR.")
      Rails.logger.error("Ingest collection from proposal error: #{cmr_response.clean_inspect}")
    end
  end

  def update_proposal_status_in_dmmt(proposal)
    dmmt_response = if Rails.env.test?
                      cmr_client.dmmt_update_proposal_status({ 'draft_type': proposal['draft_type'], 'id': proposal['id'] }, token, request)
                    else
                      cmr_client.dmmt_update_proposal_status({ 'draft_type': proposal['draft_type'], 'id': proposal['id'] }, token)
                    end
    return if dmmt_response.success?
    flash[:error] = I18n.t('controllers.manage_proposal.publish_proposal.flash.update_proposal_status.error')
    Rails.logger.info("Audit Log: dMMT did not successfully transition #{proposal['draft_type']} with id #{proposal['id']} to 'done' status from 'approved'.")
  end

  def submitter_from_proposal(proposal)
    proposal_urs_user = retrieve_urs_users([proposal['submitter_id']])[0]
    proposal_urs_user.blank? ? nil : { name: "#{proposal_urs_user['first_name']} #{proposal_urs_user['last_name']}", email: proposal_urs_user['email_address'] }
  end
end
