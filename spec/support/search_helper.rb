module Helpers
  module SearchHelpers
    def full_search(options = {})
      record_type = options[:record_type] || 'Collections'
      provider = options[:provider]
      keyword = options[:keyword] || ''

      click_on 'Full Metadata Record Search'
      choose record_type
      select provider, from: 'provider_id' if provider
      fill_in 'keyword', with: keyword
      click_on 'Submit'
    end
  end
end
