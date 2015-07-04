class PagesController < ApplicationController

  def dashboard

    @notification = Page::notification_prep(cmr_client.get_calendar_events)

  end
end
