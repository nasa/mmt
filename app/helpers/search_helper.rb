module SearchHelper
  def results_query_label(query)
    query.delete('page_num')
    query.delete('page_size')

    pruned = prune_query(query.clone)

    # We might want to worry about how we order this at some point
    return if pruned.empty?

    results = []

    special_keys = %w(record_state review_status record_type date_filter on_or_after author_type search_term_type)

    pruned.each do |key, value|
      if key == 'sort_key'
        value = value.gsub('revision_date', 'last_modified')
        descending = value.starts_with?('-')
        usable_value = value.tr('-', ' ').tr('_', ' ').titleize
        usable_value += descending ? ' Desc' : ' Asc'
      elsif special_keys.include?(key.to_s)
        # You want to de-dash and titleize some search values but not others
        usable_value = value.tr('-', ' ').tr('_', ' ').titleize
      else
        usable_value = value
      end
      results << "#{key.to_s.tr('_', ' ').titleize}: #{usable_value}"
    end
    "for: #{results.join(' | ')}"
  end

  def prune_query(query)
    # Remove params the user doesn't care about or didn't add
    query.delete('controller')
    query.delete('action')
    query.delete('search_type')
    query.delete('search_term_type')
    query.delete('search_term')
    query.delete('review_status')
    query.delete('date_filter')
    query.delete('author_type')
    query.delete('on_or_after')
    query.delete('record_type')
    query.delete('quick_find')
    query.delete('full_search')
    query.delete('find')
    query
  end

  def sort_by_link(title, sort_key, query)
    params = query.clone
    link_type = nil
    if query['sort_key'] && query['sort_key'].include?(sort_key)
      link_type = 'desc'
      unless query['sort_key'].starts_with?('-')
        link_type = 'asc'
        sort_key = "-#{sort_key}"
      end
    end

    params['sort_key'] = sort_key

    url = "/search?#{params.to_query}"

    link_to "#{title} <i class='fa fa-sort#{'-' + link_type if link_type}'></i>".html_safe, url, title: "Sort by #{title} #{link_type == 'asc' ? 'Desc' : 'Asc'}"
  end
end
