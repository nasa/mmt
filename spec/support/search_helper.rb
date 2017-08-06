module Helpers
  module SearchHelpers
    def full_search(keyword: '', record_type: 'Collections', provider: nil)
      # Display the full search modal
      click_on 'search-drop'

      # Populate the form with the provided attributes
      choose record_type
      select provider, from: 'provider_id' unless provider.nil?
      fill_in 'keyword', with: keyword

      click_button 'Search Collections'
    end
  end
end
