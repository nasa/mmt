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

    def xfill_in(initialization_storage, locator, options={})
      raise "Must pass a hash containing 'with'" if not options.is_a?(Hash) or not options.has_key?(:with)
      with = options.delete(:with)
      fill_options = options.delete(:fill_options)
      puts "ISI  =  #{initialization_storage.inspect}"
      puts "X called with #{with}"
      initialization_storage << {locator=> with}
      find(:fillable_field, locator, options).set(with, fill_options)
    end

  end
end

