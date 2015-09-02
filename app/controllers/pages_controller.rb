class PagesController < ApplicationController

  def dashboard
    puts "IDB1"
    reply = cmr_client.get_calendar_events
    puts "IDB2"
    if reply.status != 200
      @notification = 'System availability notifications may be unavailable for a brief period due to planned maintenance. We apologize for the inconvenience.'
    else
      @notification = reply.body
    end
    #@notification = reply.body
    @draft_display_max_count = 5 # If you change this number you must also change it in the corresponding test file - features/drafts/open_drafts_spec.rb.
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
