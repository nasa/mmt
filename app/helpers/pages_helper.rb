module PagesHelper
  def notification_time_span(notification)
    return nil unless notification && notification['start_date']

    start_date = DateTime.parse(notification['start_date']).in_time_zone('Eastern Time (US & Canada)')
    end_date = notification['end_date'].nil? ? 'ongoing' : DateTime.parse(notification['start_date']).in_time_zone('Eastern Time (US & Canada)')

    start_date = start_date.strftime('%Y-%m-%d %H:%M:%S')
    end_date = end_date.strftime('%Y-%m-%d %H:%M:%S') unless end_date.is_a? String

    "(#{start_date} - #{end_date})"
  end

  def display_entry_id(draft_or_collection)
    # empty collection ShortName should display 'New Collection'
    if draft_or_collection.is_a?(Draft)
      entry_id = draft_or_collection.display_short_name
      entry_id += ' ' + draft_or_collection.draft['Version'] unless draft_or_collection.draft['Version'].nil?
    else
      entry_id = draft_or_collection['ShortName'] || 'New Collection'
      entry_id += ' ' + draft_or_collection['Version'] unless draft_or_collection['Version'].nil?
    end

    entry_id
  end
end
