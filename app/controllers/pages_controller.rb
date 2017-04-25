# :nodoc:
class PagesController < ApplicationController
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
