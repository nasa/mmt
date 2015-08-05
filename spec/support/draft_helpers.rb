module Helpers
  module DraftHelpers

    def create_new_draft
      visit '/dashboard'
      choose 'New Collection Record'
      click_on 'Create Record'
    end

    # Traverse the JSON (depth first), checking all values on all branches for display on this page.
    def check_page_for_display_of_values (page, draft, special_handling={})
      case draft.class.to_s
        when nil
        when 'String'
          expect(page).to have_content(draft)
        when 'Hash'
          draft.each do |key, value|
            if value.is_a? String
              if special_handling[key] == :handle_as_currency && value =~ /\A[-+]?\d*\.?\d+\z/
                value = number_to_currency(value.to_f)
              end
              expect(page).to have_content(value)
            else
              check_page_for_display_of_values(page, value, special_handling)
            end
          end
        when 'Array'
          draft.each do |value|
            check_page_for_display_of_values(page, value, special_handling)
          end
        else
          puts ("Class Unknown: #{draft.class}")
      end
    end

    def check_section_for_display_of_values (page, draft, special_handling={})
      case draft.class.to_s
        when nil
        when 'String'
          expect(page).to have_content(draft)
          #puts "Checking for #{draft}"
        when 'Hash'
          draft.each do |key, value|
            if value.is_a? String
              if special_handling[key] == :handle_as_currency && value =~ /\A[-+]?\d*\.?\d+\z/
                value = number_to_currency(value.to_f)
              end
              target =  "#{key.to_s.titleize}: #{value}"
              expect(page).to have_content(target)
            else
              check_section_for_display_of_values(page, value, special_handling)
            end
          end
        when 'Array'
          draft.each do |value|
            check_section_for_display_of_values(page, value, special_handling)
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
        raise "Must pass in a 'from' parameter"
      end
    end

  end
end

