module Proposal
  class CollectionDraftProposalsController < CollectionDraftsController
    skip_before_action :provider_set?

    # TODO: Limit this to only the things a user is supposed to do, also need a new one for approver
    # TODO: Also need one for functions which both can perform (e.g. show)
    before_action :ensure_non_nasa_draft_user
    before_action(only: %I[submit rescind progress]) { set_resource }

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
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} submitted #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")

        ProposalMailer.proposal_submitted_notification(get_user_info, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id']).deliver_now
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully submitted #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.error")
      end
      redirect_to collection_draft_proposal_path(get_resource)
    end

    def rescind
      authorize get_resource

      remove_status_history('submitted')

      if get_resource.rescind && get_resource.save
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
        @first_information = "Submitted: #{@status_history['submitted']['action_date']} UTC By: #{@status_history['submitted']['username']}"
      end

      if @status_history['approved']
        @second_information = "Approved: #{@status_history['approved']['action_date']} UTC By: #{@status_history['approved']['username']}"
      elsif @status_history['rejected']
        @second_information = "Rejected: #{@status_history['rejected']['action_date']} UTC By: #{@status_history['rejected']['username']}"
        @rejection_reason = "Reason: #{approver_feedback.fetch('rejection_reason', 'No Reason Provided')}"
      end

      @fourth_information = "Published: #{@status_history['done']['action_date']} UTC By: #{@status_history['done']['username']}" if get_resource.proposal_status == 'done'

      @available_actions =  if get_resource.in_work?
                              'Make additional changes or submit this proposal for approval.'
                            elsif get_resource.submitted? || get_resource.rejected?
                              'You may rescind this proposal to make additional changes.'
                            else
                              'No actions are possible.'
                            end
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
      get_resource.status_history[target] = { 'username' => session[:name], 'action_date' => Time.new.utc.to_s }
    end

    def remove_status_history(target)
      get_resource.status_history.delete(target)
    end
  end
end
