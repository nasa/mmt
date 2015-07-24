module SearchHelper
  def results_query_label(query)
    query.delete('page')
    query.delete('latest') # at least right now we added this, so don't show it
    pruned = prune_query(query.clone)

    # We might want to worry about how we order this at some point
    unless pruned.empty?
      result = 'for: '

      special_keys = ['record_state', 'review_status', 'record_type','date_filter', 'on_or_after','author_type','search_term_type']

      pruned.each do |key, value|
        # You want to de-dash and titleize some search values but not others
        if special_keys.include?(key)
          usable_value = value.gsub('-', ' ').titleize
        else
          usable_value = value
        end
        result += "#{key.gsub('_', ' ').titleize}: #{usable_value} | "
      end
      result[0..-3]
    end
  end

  def prune_query(query)
    # Remove params the user doesn't care about or didn't add
    query.delete('controller')
    query.delete('action')
    query.delete('page')
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


end
