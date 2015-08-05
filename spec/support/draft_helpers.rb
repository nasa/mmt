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

    def mmt_fill_in(init_store, locator, options={})
      with = options[:with]
      fill_in(locator, options)
      #puts init_store.inspect
      init_store << {locator=> with}
    end

    def mmt_select(init_store, value, options={})
      options_clone = options.clone
      select(value, options)
      if options_clone.has_key?(:from)
        from = options_clone.delete(:from)
        init_store << {from=> value}
      else
        # init_store << {from=> value}
        # find(:option, value, options_clone).select_option
      end
    end

  end
end

