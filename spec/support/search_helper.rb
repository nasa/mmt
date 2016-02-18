module Helpers
  module SearchHelpers
    def full_search(options = {})
      record_type = options[:record_type] || 'Collections'
      provider = options[:provider]
      search_term = options[:search_term] || ''

      click_on 'Full Metadata Record Search'
      within '.full-search-form' do
        choose record_type
        select provider, from: 'provider_id' if provider
        fill_in 'search_term', with: search_term
        click_on 'Submit'
      end
    end
  end
end
