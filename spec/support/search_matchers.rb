module SearchUtil
  # Usage
  # expect(page).to have_collection_search_query(1, "Keyword: #{entry_title}")
  # expect(page).to have_variable_search_query(1, "Keyword: #{short_name}")

  # Pass in nil for number if you don't care about the number of results, just the query
  # expect(page).to have_collection_search_query(nil, "Keyword: #{short_name}")
  RSpec::Matchers.define :have_collection_search_query do |number, *query_items|
    match do |actual|
      expect(actual.find('#search-criteria')).to have_content("#{number} Collection #{'Result'.pluralize(number)}") if number

      match_query_items(query_items)
    end
  end

  RSpec::Matchers.define :have_variable_search_query do |number, *query_items|
    match do |actual|
      expect(actual.find('#search-criteria')).to have_content("#{number} Variable #{'Result'.pluralize(number)}") if number

      match_query_items(query_items)
    end
  end

  RSpec::Matchers.define :have_service_search_query do |number, *query_items|
    match do |actual|
      expect(actual.find('#search-criteria')).to have_content("#{number} Service #{'Result'.pluralize(number)}") if number

      match_query_items(query_items)
    end
  end

  RSpec::Matchers.define :have_tool_search_query do |number, *query_items|
    match do |actual|
      expect(actual.find('#search-criteria')).to have_content("#{number} Tool #{'Result'.pluralize(number)}") if number

      match_query_items(query_items)
    end
  end

  RSpec::Matchers.define :match_query_items do |*query_items|
    match do |actual|
      Array.wrap(query_items).each do |query_item|
        expect(actual.find('#search-criteria')).to have_content(query_item)
      end
    end
  end
end
