class PagesController < ApplicationController

  def dashboard
    @notification = cmr_client.get_calendar_events().body
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
