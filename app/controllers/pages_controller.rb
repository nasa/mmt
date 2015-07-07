class PagesController < ApplicationController

  def dashboard

    @notification = cmr_client.get_calendar_events().body

  end
end
