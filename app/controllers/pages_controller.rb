class PagesController < ApplicationController

  def dashboard

    @notification = cmr_client.get_calendar_events().body

  end

  def metadata_form

  end
end
