class PagesController < ApplicationController
  include CollectionsHelper

  def dashboard
    @notifications = cmr_client.get_calendar_events.body
    @notifications.select! { |event| !session[:hidden_notifications].include?(event['id']) }

    # If you change this number you must also change it in the corresponding test file - features/drafts/open_drafts_spec.rb.
    @draft_display_max_count = 5

    @drafts = @current_user.drafts.where(provider_id: @current_user.provider_id)
                                  .order('updated_at DESC')
                                  .limit(@draft_display_max_count + 1)

    if params[:not_current_provider_draft_id] || params[:concept_id]
      get_not_current_provider_record(params)
    end
  end

  def manage_cmr
  end

  def new_record
    case params[:type]
    when 'new_collection'
      redirect_to new_draft_path
    else
      redirect_to dashboard_path
    end
  end

  def hide_notification
    notification_id = params[:id]
    session[:hidden_notifications] << notification_id

    render nothing: true
  end

  private

  def get_not_current_provider_record(params)
    # get not current provider draft or collection
    if params[:not_current_provider_draft_id]
      @not_current_provider_draft = Draft.find(params[:not_current_provider_draft_id])
      @draft_action = params[:draft_action]
      @draft_form = params[:draft_form]
    elsif params[:concept_id]
      set_collection # CollectionsHelper (moved from CollectionsController) method

      @collection_action = params[:collection_action]
      if @collection_action == 'delete' || @collection_action == 'edit'
        @collection_action += '-collection'
      end
    end
  end
end
