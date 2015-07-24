module Helpers
  module DraftHelpers
    def create_new_draft
      visit '/dashboard'
      choose 'New Collection Record'
      click_on 'Create Record'
    end
  end
end
