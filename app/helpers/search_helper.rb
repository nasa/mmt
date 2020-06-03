# :nodoc:
module SearchHelper
  def results_query_label(query)
    query.delete('page_num')
    query.delete('page_size')

    # Remove * from entry title searches
    query['entry_title'] = query['entry_title'][1..-2] if query['entry_title']
    query.delete('options[entry_title][pattern]')

    # Remove keyword if blank
    query.delete('keyword') if query['keyword'].blank?

    pruned = query.clone
    # We might want to worry about how we order this at some point
    return if pruned.empty?

    results = []

    pruned.each do |key, value|
      if key == 'sort_key'
        value = value.gsub('revision_date', 'last_modified')
        descending = value.starts_with?('-')
        usable_value = value.tr('-', ' ').tr('_', ' ').titleize
        usable_value += descending ? ' Desc' : ' Asc'
      else
        usable_value = value
      end
      results << "#{key.to_s.tr('_', ' ').titleize}: #{usable_value}"
    end
    "for: #{results.join(' | ')}"
  end

  def sort_by_link(title, sort_key, query, record_type, specified_url = nil)
    params = query.clone
    params['record_type'] = record_type unless specified_url

    link_type = nil
    if query['sort_key'] && query['sort_key'].include?(sort_key)
      link_type = 'desc'
      unless query['sort_key'].starts_with?('-')
        link_type = 'asc'
        sort_key = "-#{sort_key}"
      end
    end

    params['sort_key'] = sort_key

    url = if specified_url
            "#{specified_url}?#{params.to_query}"
          else
            "/search?#{params.to_query}"
          end

    link_to "#{title} <i class='fa fa-sort#{'-' + link_type if link_type}'></i>".html_safe, url, title: "Sort by #{title} #{link_type == 'asc' ? 'Desc' : 'Asc'}"
  end

  def display_last_modified(record)
    revision_date = record.fetch('meta', {})['revision-date']
    if revision_date.blank?
      'UNKNOWN'
    else
      DateTime.parse(revision_date).to_s(:date)
    end
  end
  
  def proposal_mode_short_dropdown
     'search-dropdown-short' if Rails.configuration.proposal_mode
  end
  
  def proposal_mode_button_visibility
     Rails.configuration.proposal_mode ? "search-disabled-radio-buttons" : "search-enabled-radio-buttons"
  end
end
