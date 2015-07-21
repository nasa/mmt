class Search

  def self.prune_query(query)
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
