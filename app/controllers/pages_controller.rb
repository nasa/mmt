class PagesController < ApplicationController
  before_filter :set_notifications, only: :manage_metadata

  def manage_metadata
    # If you change this number you must also change it in the corresponding test file - features/drafts/open_drafts_spec.rb.
    @draft_display_max_count = 5

    @drafts = current_user.drafts.where(provider_id: current_user.provider_id)
                                  .order('updated_at DESC')
                                  .limit(@draft_display_max_count + 1)
  end

  def new_record
    case params[:type]
    when 'new_collection'
      redirect_to new_draft_path
    else
      redirect_to manage_metadata_path
    end
  end

  def hide_notification
    notification_id = params[:id]
    session[:hidden_notifications] << notification_id

    render nothing: true
  end

  private

  def set_notifications
    @notifications = cmr_client.get_calendar_events.body
    @notifications.select! { |event| !session[:hidden_notifications].include?(event['id']) }
  end
end
