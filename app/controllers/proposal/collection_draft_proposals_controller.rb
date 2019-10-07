module Proposal
  class CollectionDraftProposalsController < CollectionDraftsController
    skip_before_action :provider_set?

    # TODO: Limit this to only the things a user is supposed to do, also need a new one for approver
    # TODO: Also need one for functions which both can perform (e.g. show)
    before_action :ensure_non_nasa_draft_user
    before_action(only: %I[submit rescind]) { set_resource }

    def edit
      unless get_resource&.in_work?
        flash[:error] = 'Only proposals in an "In Work" status can be edited.'
        redirect_to collection_draft_proposal_path(get_resource) and return
      end
      super
    end

    def submit
      authorize get_resource

      if get_resource.submit && get_resource.save
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} submitted #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")

        ProposalMailer.proposal_submitted_notification(get_user_info, get_resource.draft['ShortName'], get_resource.draft['Version'], params['id']).deliver_now
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully submitted #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.submit.flash.error")
      end
      redirect_to collection_draft_proposal_path(get_resource) and return
    end

    def rescind
      authorize get_resource

      if get_resource.rescind && get_resource.save
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.success")
      else
        Rails.logger.info("Audit Log: User #{current_user.urs_uid} unsuccessfully rescinded #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}")
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.rescind.flash.error")
      end
      redirect_to collection_draft_proposal_path(get_resource) and return
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
      unless get_resource&.in_work?
        flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.destroy.flash.error") + '. Only proposals in an "In Work" status can be deleted.'
        redirect_to collection_draft_proposal_path(get_resource) and return
      end
      super
    end

    private

    def set_resource_by_model
      # Doing this way because don't want provider id being sent
      set_resource(CollectionDraftProposal.new(user: current_user, draft: {}))
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
  end
end
