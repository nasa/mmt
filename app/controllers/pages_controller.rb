class PagesController < ApplicationController
  def dashboard

    @event_query_results = cmr_client.get_calendar_events

    @notification_limit = 1 # Max Number of notifications to display

    current_time = DateTime.current.to_s

    # Next line for testing & dev only
    current_time = (DateTime.current-(1.year)).to_s

    @events = @event_query_results.body.delete_if {|event| event['calendar_event']['end_date'] < current_time }

    @events.sort! {|x, y| x['calendar_event']['start_date'] <=> y['calendar_event']['start_date']}

  end
end
