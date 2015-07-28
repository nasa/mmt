class PagesController < ApplicationController

  def dashboard
    @notification = cmr_client.get_calendar_events().body
    @draft_display_max_count = 2
    @drafts = @current_user.drafts.order("updated_at DESC").limit(@draft_display_max_count+1)
  end

  def new_record
    case params[:type]
    when 'new_collection'
      redirect_to new_draft_path
    else
      redirect_to dashboard_path
    end
  end
end
