module SearchUtil
  # Usage
  # expect(page).to have_search_query(1, "Entry Id: #{entry_id}")
  # expect(page).to have_search_query(1, "Entry Id: #{entry_id}", "Record State: Published Records")
  RSpec::Matchers.define "have_search_query" do |number, *query_items|
    match do |actual|
      expect(actual.find('#collection_search_criteria')).to(have_content("#{number} #{'Result'.pluralize(number)}"))

      Array.wrap(query_items).each do |query_item|
        expect(actual.find('#collection_search_criteria')).to(have_content(query_item))
      end
    end
  end
end
