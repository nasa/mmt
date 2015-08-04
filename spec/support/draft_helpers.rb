module Helpers
  module DraftHelpers

    def create_new_draft
      visit '/dashboard'
      choose 'New Collection Record'
      click_on 'Create Record'
    end

    # Traverse the JSON (depth first), checking all values on all branches for display on this page.
    def check_page_for_display_of_values (page, draft)
      case draft.class.to_s
        when nil
        when 'String'
          expect(page).to have_content(draft)
        when 'Hash'
          draft.each do |k, v|
            check_page_for_display_of_values(page, v)
          end
        when 'Array'
          draft.each do |v|
            check_page_for_display_of_values(page, v)
          end
        else
          puts ("Class Unknown: #{draft.class}")
      end
    end

  end
end

