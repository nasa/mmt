module SearchHelper
  def results_query_label(query)
    query.delete('page')
    query.delete('latest') # at least right now we added this, so don't show it
    pruned = prune_query(query.clone)

    # We might want to worry about how we order this at some point
    unless pruned.empty?
      result = 'for: '
      pruned.each do |key, value|
        # You want to de-dash and titleize some search values but not others
        if  key == 'record-state' || key == 'review-status' || key == 'record-type' ||
            key == 'date-filter'   || key == 'on-or-after' ||  key == 'author-type'   || key == 'search-term-type'
          usable_value = value.gsub('-', ' ').titleize
        else
          usable_value = value
        end
        result += "#{key.gsub('-', ' ').titleize}: #{usable_value} | "
      end
      result[0..-3]
    end
  end

  def prune_query(query)
    # Remove params the user doesn't care about or didn't add
    query.delete('controller')
    query.delete('action')
    query.delete('page')
    query.delete('search-term-type')
    query.delete('search-term')
    query.delete('review-status')
    query.delete('date-filter')
    query.delete('author-type')
    query.delete('on-or-after')
    query.delete('record-type')
    query.delete('quick-find')
    query.delete('full-search')
    query.delete('find')
    query
  end
end
