module PagesHelper
  def notification_time_span(notification)
    return nil unless notification && notification['start_date']

    start_date = DateTime.parse(notification['start_date']).in_time_zone('Eastern Time (US & Canada)')
    end_date = notification['end_date'].nil? ? 'ongoing' : DateTime.parse(notification['start_date']).in_time_zone('Eastern Time (US & Canada)')

    start_date = start_date.strftime('%Y-%m-%d %H:%M:%S')
    end_date = end_date.strftime('%Y-%m-%d %H:%M:%S') unless end_date.is_a? String

    "(#{start_date} - #{end_date})"
  end
end
