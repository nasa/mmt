module Proposal
  class CollectionDraftProposalsController < CollectionDraftsController
    include GroupEndpoints

    skip_before_action :provider_set?

    before_action :ensure_non_nasa_draft_permissions
    before_action :check_approver_status, only: [:show, :progress]
    before_action(only: [:submit, :rescind, :progress, :approve, :reject]) { set_resource }

    def index
      resources = resource_class.order(index_sort_order)
                                .page(params[:page]).per(RESULTS_PER_PAGE)
      instance_variable_set("@#{plural_resource_name}", resources)
      @category_of_displayed_proposal = 'Collection'
      @specified_url = '/collection_draft_proposals'
    end

    def queued_index
      resources = resource_class.where('proposal_status != ?', 'in_work')
      .order(index_sort_order)
      .page(params[:page]).per(RESULTS_PER_PAGE)
      instance_variable_set("@#{plural_resource_name}", resources)
      @category_of_displayed_proposal = 'Queued'
      @specified_url = '/collection_draft_proposals/queued_index'
      render :index
    end

    def in_work_index
      resources = resource_class.where('proposal_status = ?', 'in_work')
      .order(index_sort_order)
      .page(params[:page]).per(RESULTS_PER_PAGE)
      instance_variable_set("@#{plural_resource_name}", resources)
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
        show_view_setup
        load_umm_schema
        @errors = validate_metadata
      else
        @first_stage = 'Submitted for Review'
        @first_information = get_progress_message('submitted')
      end

      if @status_history['approved']
        @second_stage = 'Approved'
        @second_information = get_progress_message('approved')
      elsif @status_history['rejected']
        @second_stage = 'Rejected'
        @second_information = get_progress_message('rejected')
        @rejection_reasons = approver_feedback.fetch('reasons', ['No Reason Provided'])
        @rejection_note = approver_feedback.fetch('note', 'No Notes Provided')
      end

      @fourth_information = get_progress_message('done') if get_resource.proposal_status == 'done'
    end

    def submit
      authorize get_resource

      add_status_history('submitted')
      remove_status_history('rejected')

      if get_resource.submit && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} successfully submitted #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")

        ProposalMailer.proposal_submitted_notification(get_user_info, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id']).deliver_now

        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully attempted to submit #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.error")
      end

      redirect_to collection_draft_proposal_path(get_resource)
    end

    def rescind
      authorize get_resource

      remove_status_history('submitted')

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

      add_status_history('approved')

      if get_resource.approve && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} successfully approved #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")

        user_from_resource_response = user_from_resource
        # User e-mail
        ProposalMailer.proposal_approved_notification(user_from_resource_response, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id']).deliver_now if user_from_resource_response
        # Approver e-mail
        ProposalMailer.proposal_approved_notification(get_user_info, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id']).deliver_now

        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.approve.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully attempted to approve #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.approve.flash.error")
      end

      redirect_to collection_draft_proposal_path(get_resource)
    end

    def reject
      authorize get_resource

      get_resource.approver_feedback = params[:rejection]
      add_status_history('rejected')

      if get_resource.reject && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} successfully rejected #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} (a #{get_resource.request_type} metadata request).")
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.reject.flash.success")
        # TODO: success mailer
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
      clear_session_and_token_data

      redirect_to root_url, flash: { error: "It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}." }
    end

    # TODO: these status methods should probably be moved into the model
    def add_status_history(target)
      get_resource.status_history ||= {}
      get_resource.status_history[target] = { 'username' => session[:name], 'action_date' => Time.new }
    end

    def remove_status_history(target)
      get_resource.status_history&.delete(target)
    end

    def get_progress_message(action)
      if @status_history.fetch(action, {}).blank?
        action_time = 'No Date Provided'
        action_username = 'No User Provided'
        Rails.logger.info("The progress page was loaded with a record that does not have a status_history and is not in_work.  The origin of this record (#{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}) should be investigated.")
      else
        action_time = @status_history[action]['action_date'].in_time_zone('UTC').to_s(:default_with_time_zone)
        action_username = @status_history[action]['username']
      end
      "#{action == 'done' ? 'Published' : action.titleize}: #{action_time} By: #{action_username}"
    end

    # Fetch e-mails of users who are not the current user from URS to send them
    # e-mails.
    def user_from_resource
      proposal_urs_user = retrieve_urs_users([User.find(get_resource.user_id).urs_uid])[0]
      { name: "#{proposal_urs_user['first_name']} #{proposal_urs_user['last_name']}", email: proposal_urs_user['email_address'] } unless proposal_urs_user.blank?
    end

    # Used as a before action to manipulate which look of the role based
    # two-look pages is used.
    def check_approver_status
      @non_nasa_approver = approver?
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
  end
end
