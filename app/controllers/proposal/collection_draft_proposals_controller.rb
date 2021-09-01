module Proposal
  class CollectionDraftProposalsController < CollectionDraftsController
    include UrsUserEndpoints
    include ProposalIndex

    skip_before_action :provider_set?

    before_action :ensure_non_nasa_draft_permissions, except: [:download_json]
    before_action(only: [:submit, :rescind, :progress, :approve, :reject]) { set_resource }
    before_action(only: [:submit]) do
      load_umm_c_schema
      collection_validation_setup
      verify_valid_metadata
    end

    def index
      working_proposals = current_user.send(plural_resource_name)
      authorize working_proposals
      set_urs_user_hash(working_proposals)
      sort_for_index(working_proposals)

      @category_of_displayed_proposal = 'Collection'
      @specified_url = '/collection_draft_proposals'
    end

    def queued_index
      working_proposals = resource_class.where('proposal_status != ?', 'in_work')
      authorize working_proposals
      set_urs_user_hash(working_proposals)
      sort_for_index(working_proposals)

      @category_of_displayed_proposal = 'Queued'
      @specified_url = '/collection_draft_proposals/queued_index'
      render :index
    end

    def in_work_index
      working_proposals = resource_class.where('proposal_status = ?', 'in_work')
      authorize working_proposals
      set_urs_user_hash(working_proposals)
      sort_for_index(working_proposals)

      @category_of_displayed_proposal = 'In Work'
      @specified_url = '/collection_draft_proposals/in_work_index'
      render :index
    end

    def edit
      if get_resource&.in_work?
        super
      else
        flash[:error] = 'Only proposals in an "In Work" status can be edited.'
        redirect_to collection_draft_proposal_path(get_resource)
      end
    end

    def update
      if get_resource&.in_work?
        super
      else
        flash[:error] = 'Only proposals in an "In Work" status can be edited.'
        redirect_to collection_draft_proposal_path(get_resource)
      end
    end

    def destroy
      # According to the documentation, only "In Work" proposals should be deletable
      # "Rejected" and "Submitted" can be rescinded to "In Work" to be deleted.
      # "Approved" and "Done" can be neither rescinded nor deleted.
      if get_resource&.in_work?
        super
      else
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.destroy.flash.error") + '. Only proposals in an "In Work" status can be deleted.'
        redirect_to collection_draft_proposal_path(get_resource)
      end
    end

    def progress
      authorize get_resource

      add_breadcrumb fetch_entry_id(get_resource.draft, resource_name), send("#{resource_name}_path", get_resource)
      add_breadcrumb 'Progress', send("progress_#{resource_name}_path", get_resource)
      @status_history = get_resource.status_history || {}
      approver_feedback = get_resource.approver_feedback || {}

      @second_stage = 'Approval'

      if get_resource.in_work?
        @first_stage = 'In Work'

        # This applies the same validation as is applied on the preview/show page
        collection_validation_setup
        load_umm_c_schema
        @errors = validate_metadata
      else
        @first_stage = 'Submitted for Review'
        @first_information = get_resource.progress_message('submitted')
      end

      if @status_history['approved']
        @second_stage = 'Approved'
        @second_information = get_resource.progress_message('approved')
      elsif @status_history['rejected']
        @second_stage = 'Rejected'
        @second_information = get_resource.progress_message('rejected')
        @rejection_reasons = approver_feedback.fetch('reasons', ['No Reason Provided'])
        @rejection_note = approver_feedback.fetch('note', 'No Notes Provided')
      end

      @fourth_information = get_resource.progress_message('done') if get_resource.proposal_status == 'done'
    end

    def submit
      authorize get_resource

      get_resource.add_status_history('submitted', session[:name])
      get_resource.remove_status_history('rejected')
      get_resource.submitter_id = current_user[:urs_uid]

      if get_resource.submit && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} successfully submitted #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")

        ProposalMailer.proposal_submitted_notification(get_user_info, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id'], get_resource.request_type).deliver_now
        approver_users = get_approver_emails
        approver_users.each do |approver|
          ProposalMailer.proposal_submitted_approvers_notification(approver, get_resource, get_user_info).deliver_now
        end

        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully attempted to submit #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.error")
      end

      redirect_to collection_draft_proposal_path(get_resource)
    end

    def rescind
      authorize get_resource

      get_resource.remove_status_history('submitted')
      get_resource.submitter_id = nil

      # An in_work delete request does not make sense.  If a delete request is
      # rescinded, delete the request instead.
      if get_resource.request_type == 'delete'
        short_name = get_resource.draft['ShortName']
        if get_resource.rescind && get_resource.destroy
          Rails.logger.info("Audit Log: User #{current_user.urs_uid} successfully rescinded and destroyed #{resource_name.titleize} #{get_resource.entry_title} (a #{get_resource.request_type} metadata request).")
          flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.delete.success", short_name: short_name)

          redirect_to manage_collection_proposals_path and return
        else
          Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully attempted to rescind and destroy #{resource_name.titleize} #{get_resource.entry_title} (a #{get_resource.request_type} metadata request).")
          flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.delete.error", short_name: short_name)
        end
      elsif get_resource.rescind && get_resource.save
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.success")
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} successfully rescinded #{resource_name.titleize} #{get_resource.entry_title} (a #{get_resource.request_type} metadata request).")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully attempted to rescind #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.error")
      end

      redirect_to collection_draft_proposal_path(get_resource)
    end

    def approve
      authorize get_resource

      get_resource.add_status_history('approved', session[:name])

      if get_resource.approve && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} successfully approved #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")

        submitter_from_resource_response = submitter_from_resource
        # User e-mail
        ProposalMailer.proposal_approved_notification(submitter_from_resource_response, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id'], get_resource.proposal_status).deliver_now if submitter_from_resource_response
        # Approver e-mail
        ProposalMailer.proposal_approved_notification(get_user_info, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id'], get_resource.proposal_status).deliver_now

        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.approve.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully attempted to approve #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.approve.flash.error")
      end

      redirect_to collection_draft_proposal_path(get_resource)
    end

    def reject
      authorize get_resource

      # params[:rejection] == {'note' => ''} when the form is submitted blank,
      # so delete the key if there is no content
      params[:rejection].delete('note') if params[:rejection]['note'].blank?
      get_resource.approver_feedback = params[:rejection]
      get_resource.add_status_history('rejected', session[:name])

      if get_resource.reject && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} successfully rejected #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.reject.flash.success")

        submitter_from_resource_response = submitter_from_resource
        # User e-mail
        ProposalMailer.proposal_rejected_notification(user: submitter_from_resource_response, proposal: get_resource, approver: false).deliver_now if submitter_from_resource_response
        # Approver e-mail
        ProposalMailer.proposal_rejected_notification(user: get_user_info, proposal: get_resource, approver: true).deliver_now
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully attempted to reject #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.reject.flash.error")
      end

      redirect_to collection_draft_proposal_path(get_resource)
    end

    def publish
      # This action is NOT allowed in the Draft MMT and should not be accessible
      # to a user. We are only declaring it here to block any action as an extra
      # layer of defense
      authorize get_resource

      flash[:error] = 'Collection Draft Proposals cannot be published directly through the Draft MMT. To publish a Collection Draft Proposal, please Submit it for approval.'
      redirect_to manage_collection_proposals_path
    end

    private

    def set_resource_by_model
      # Doing this way because don't want provider id being sent
      set_resource(CollectionDraftProposal.new(user: current_user, draft: {}, request_type: 'create'))
    end

    def proposal_mode_enabled?
      # in regular mmt all proposal actions should be blocked
      redirect_to manage_collections_path unless Rails.configuration.proposal_mode
    end

    # Custom error messaging for Pundit
    def user_not_authorized(exception)
      flash[:error] = I18n.t("collection_draft_proposal_policy.#{exception.query}", scope: 'pundit', default: :default)

      if exception.query == 'new?' || exception.query == 'create?'
        # the user has no permissions to access proposal mode
        clear_session_and_token_data
        redirect_to root_url
      else
        redirect_to manage_collection_proposals_path
      end
    end

    # Fetch e-mails of users who are not the current user from URS to send them
    # e-mails.
    def submitter_from_resource
      proposal_urs_user = retrieve_urs_users([get_resource.submitter_id])[0]
      { name: "#{proposal_urs_user['first_name']} #{proposal_urs_user['last_name']}", email: proposal_urs_user['email_address'] } unless proposal_urs_user.blank?
    end

    # Get urs users and get emails from urs for approvers
    # Returns array of hashes for each user
    def get_approver_emails
      provider_targets = if Rails.env.production?
                           %w[SCIOPS]
                         elsif Rails.env.development? || Rails.env.test?
                           %w[MMT_2]
                         elsif Rails.env.sit? || Rails.env.uat?
                           %w[SCIOPS SCIOPSTEST]
                         end

      approvers_urs_users = []

      provider_targets.each do |provider_target|
        # Find the ACL for correct provider in this env.
        find_acl_response = cmr_client.get_permissions({ 'provider' => provider_target, 'target' => 'NON_NASA_DRAFT_APPROVER', 'include_full_acl' => true }, token)
        Rails.logger.debug("ACL query response while trying to send approvers emails on proposal submission for #{provider_target}: #{find_acl_response.body}")
        next unless find_acl_response.success? && find_acl_response.body['items'].count == 1

        approver_groups_list = find_acl_response.body['items'][0]['acl']['group_permissions'].map { |group| group['group_id'] if group['permissions'].include?('create') }.compact
        next if approver_groups_list.empty?

        # For each group that has this acl, collect the users to send to URS
        approver_groups_list.each do |group|
          group_member_response = cmr_client.get_group_members(group, token)
          next unless group_member_response.success?

          approvers_urs_users += group_member_response.body
        end
      end
      return [] if approvers_urs_users.empty?

      # Get e-mails from URS using user names
      approver_urs_users = retrieve_urs_users(approvers_urs_users.uniq)
      approver_emails = []
      approver_urs_users.each do |approver|
        approver_emails.push(name: "#{approver['first_name']} #{approver['last_name']}", email: approver['email_address'])
      end
      approver_emails
    end

    # TODO: Investigate if this can be used to provide sorting to all drafts.
    # It probably can, but MMT-1966 was already quite large.
    # Translate the result of the sort_by_link helper into a string that can fit
    # in the 'order' command
    def index_sort_order
      @query = {}
      @query['sort_key'] = params['sort_key'] unless params['sort_key'].blank?

      if @query['sort_key']&.starts_with?('-')
        "#{@query['sort_key'].delete_prefix('-')} DESC"
      elsif @query['sort_key'].present?
        "#{@query['sort_key']} ASC"
      else
        'updated_at DESC'
      end
    end

    def sort_for_index(working_proposals)
      if params['sort_key']&.include?('submitter_id')
        resources = sort_by_submitter(working_proposals, @urs_user_hash)
        instance_variable_set("@#{plural_resource_name}", Kaminari.paginate_array(resources, total_count: resources.count).page(params.fetch('page', 1)).per(RESULTS_PER_PAGE))
      else
        resources = working_proposals.order(index_sort_order)
                                     .page(params[:page]).per(RESULTS_PER_PAGE)
        instance_variable_set("@#{plural_resource_name}", resources)
      end
    end
  end
end
