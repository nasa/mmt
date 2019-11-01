module Proposal
  class CollectionDraftProposalsController < CollectionDraftsController
    include GroupEndpoints
    skip_before_action :provider_set?

    # TODO: Limit this to only the things a user is supposed to do, also need a new one for approver
    # TODO: Also need one for functions which both can perform (e.g. show)

    before_action :ensure_non_nasa_draft_permissions
    before_action(only: [:submit, :rescind, :progress, :approve]) { set_resource }
    before_action :approver_status, only: [:show, :progress]

    def edit
      if get_resource&.in_work?
        super
      else
        flash[:error] = 'Only proposals in an "In Work" status can be edited.'
        redirect_to collection_draft_proposal_path(get_resource)
      end
    end

    def submit
      authorize get_resource

      add_status_history('submitted')
      remove_status_history('rejected')

      if get_resource.submit && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} submitted #{resource_name.titleize} (a #{get_resource.request_type} metadata request) with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")

        ProposalMailer.proposal_submitted_notification(get_user_info, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id']).deliver_now
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully submitted #{resource_name.titleize} (a #{get_resource.request_type} metadata request) with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")
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
          Rails.logger.info("Audit Log: #{resource_name.titleize} #{get_resource.entry_title} (a #{get_resource.request_type} metadata request) was rescinded and destroyed by #{current_user.urs_uid}")
          flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.delete.success", short_name: short_name)
          redirect_to manage_collection_proposals_path and return
        else
          Rails.logger.info("Audit Log: Attempt to rescind and destroy #{resource_name.titleize} #{get_resource.entry_title} (a #{get_resource.request_type} metadata request) by #{current_user.urs_uid} failed.")
          flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.delete.error", short_name: short_name)
        end
      elsif get_resource.rescind && get_resource.save
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully rescinded #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.error")
      end
      redirect_to collection_draft_proposal_path(get_resource)
    end

    def publish
      authorize get_resource

      flash[:error] = 'Collection Draft Proposal cannot be published.'
      redirect_to manage_collection_proposals_path
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
        @second_information = get_progress_message('approved')
      elsif @status_history['rejected']
        @second_information = get_progress_message('rejected')
        @rejection_reason = "Reason: #{approver_feedback.fetch('rejection_reason', 'No Reason Provided')}"
      end

      @fourth_information = get_progress_message('done') if get_resource.proposal_status == 'done'

      @available_actions =  get_available_actions_text
    end

    def approve
      authorize get_resource

      add_status_history('approved')

      if get_resource.approve && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} approved #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")

        user_from_resource_response = user_from_resource
        # User e-mail
        ProposalMailer.proposal_approved_notification(user_from_resource_response, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id']).deliver_now if user_from_resource_response
        # Approver e-mail
        ProposalMailer.proposal_approved_notification(get_user_info, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id']).deliver_now
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.approve.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully submitted #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.approve.flash.error")
      end
      redirect_to collection_draft_proposal_path(get_resource)
    end

    def queued_index
      index_resources('proposal_status != ?', 'in_work')
      @proposal_type = 'Queued'
      @specified_url = '/collection_draft_proposals/queued_index'
      render :index
    end

    def upcoming_index
      index_resources('proposal_status = ?', 'in_work')
      @proposal_type = 'Upcoming'
      @specified_url = '/collection_draft_proposals/upcoming_index'
      render :index
    end

    def index
      @proposal_type = 'Collection'
      @specified_url = '/collection_draft_proposals'
      index_resources(nil, nil)
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
    def approver_status
      @non_nasa_approver = is_non_nasa_draft_approver?(user: current_user, token: token)
    end

    def get_available_actions_text
      if get_resource.in_work?
        'Make additional changes or submit this proposal for approval.'
      elsif @non_nasa_approver
        if get_resource.approved?
          'Please visit the Metadata Management Tool for NASA users to finish publishing this metadata.'
        elsif get_resource.done?
          'No actions are possible.'
        end
      elsif get_resource.submitted? || get_resource.rejected?
        'You may rescind this proposal to make additional changes.'
      else
        'No actions are possible.'
      end
    end

    # Pass in the parameters of the where clause to restrict which proposals are
    # displayed.  Passing nil for both is valid and returns all proposals.
    # TODO: Investigate if this can be used to provide sorting to all drafts.
    # It probably can, but MMT-1966 was already quite large.
    def index_resources(where_equality, where_target)
      resources = CollectionDraftProposal.where(where_equality, where_target).order(index_sort_order).page(params[:page]).per(RESULTS_PER_PAGE)

      plural_resource = "@#{plural_resource_name}"
      instance_variable_set(plural_resource, resources)
    end

    # Translate the result of the sort_by_link helper into a string that can fit
    # in the 'order' command
    def index_sort_order
      @query = {}
      @query['sort_key'] = params['sort_key'] unless params['sort_key'].blank?

      if @query['sort_key']&.starts_with?('-')
        "#{@query['sort_key'].delete_prefix('-')} ASC"
      elsif @query['sort_key'].present?
        "#{@query['sort_key']} DESC"
      else
        'updated_at DESC'
      end
    end
  end
end
