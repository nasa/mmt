module SearchUtil
  # Usage
  # expect(page).to have_search_query(1, "Short Name: #{short_name}")
  # expect(page).to have_search_query(1, "Short Name: #{short_name}", "Record State: Published Records")

  # Pass in nil for number if you don't care about the number of results, just the query
  # expect(page).to have_search_query(nil, "Short Name: #{short_name}")
  RSpec::Matchers.define 'have_search_query' do |number, *query_items|
    match do |actual|
      expect(actual.find('#collection_search_criteria')).to(have_content("#{number} #{'Result'.pluralize(number)}")) if number

      Array.wrap(query_items).each do |query_item|
        expect(actual.find('#collection_search_criteria')).to(have_content(query_item))
      end
    end
  end
end
