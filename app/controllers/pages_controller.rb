class PagesController < ApplicationController
  def dashboard
    response = cmr_client.get_calendar_events.body
    if response[:message] && !session[:hidden_notifications].include?(response[:id])
      @notification = response
    else
      @notification = nil
    end

    # If you change this number you must also change it in the corresponding test file - features/drafts/open_drafts_spec.rb.
    @draft_display_max_count = 5

    @drafts = @current_user.drafts.order('updated_at DESC').limit(@draft_display_max_count + 1)
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
end
