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
        when 'NilClass'
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

    def check_section_for_display_of_values(page, draft, parent_key, special_handling={})
      #puts ''
      #puts "Checking for #{parent_key} (#{name_to_class(parent_key)}) (#{draft.class.to_s}) in #{page.text.gsub(/\s+/, " ").strip}"
      case draft.class.to_s
        when 'NilClass'
        when 'String'
          parent_key_special_handling = special_handling[parent_key.to_sym]
          if parent_key_special_handling == :handle_as_currency && draft =~ /\A[-+]?\d*\.?\d+\z/
            draft = number_to_currency(draft.to_f)
          elsif parent_key_special_handling == :handle_as_role
            # Map role value stored in json to what is actually supposed to be displayed
            draft = map_role_onto_display_string(draft)
          end
          expect(page).to have_content(draft)
        when 'Hash'
          draft.each_with_index do |(key, value), index|
            #puts "  H Looking for: #{name_to_class(key)} inside: #{page.text.gsub(/\s+/, " ").strip}"
            check_section_for_display_of_values(page.first(:css, ".#{name_to_class(key)}"), value, key, special_handling)
          end
        when 'Array'
          html_class_name = name_to_class(parent_key)
          draft.each_with_index do |value, index|
            #puts "  A Looking for: #{html_class_name}-#{index} inside: #{page.text.gsub(/\s+/, " ").strip}"
            check_section_for_display_of_values(page.first(:css, ".#{html_class_name}-#{index}"), value, parent_key, special_handling)
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

    def add_metadata_dates_values(init_store) #=[])
      within '.multiple.metadata-lineage' do
        within '.multiple.metadata-lineage-date' do
          mmt_select init_store, 'Create', from: 'Date Type'
          mmt_fill_in init_store, 'Date', with: '2015-07-01'
          mmt_fill_in init_store, 'draft_metadata_lineage_0_date_0_description', with: 'Create metadata' #Description

          within '.multiple.responsibility' do

            mmt_select init_store, 'Resource Provider', from: 'Role'
            find('#draft_metadata_lineage_0_date_0_responsibility_0_responsibility_organization').click

            mmt_fill_in init_store, 'Short Name', with: 'ORG_SHORT'
            mmt_fill_in init_store, 'Long Name', with: 'Organization Long Name'

            mmt_fill_in init_store, 'Service Hours', with: '9-5, M-F'
            mmt_fill_in init_store, 'Contact Instructions', with: 'Email only'

            add_contacts(init_store)
            add_addresses(init_store)
            add_related_urls(init_store)

            click_on 'Add another Responsibility'
            within '.multiple-item-1' do
              mmt_select init_store, 'Owner', from: 'Role'
              find('#draft_metadata_lineage_0_date_0_responsibility_1_responsibility_person').click

              mmt_fill_in init_store, 'First Name', with: 'First Name'
              mmt_fill_in init_store, 'Middle Name', with: 'Middle Name'
              mmt_fill_in init_store, 'Last Name', with: 'Last Name'

              mmt_fill_in init_store, 'Service Hours', with: '10-2, M-W'
              mmt_fill_in init_store, 'Contact Instructions', with: 'Email only'

              add_contacts(init_store)
              add_addresses(init_store)
              add_related_urls(init_store)
            end

          end

          click_on 'Add another Date'
          within '.multiple-item-1' do
            mmt_select init_store, 'Review', from: 'Date Type'
            mmt_fill_in init_store, 'Date', with: '2015-07-02'
            mmt_fill_in init_store, 'draft_metadata_lineage_0_date_1_description', with: 'Reviewed metadata' #Description
            within '.multiple.responsibility' do
              mmt_select init_store, 'Editor', from: 'Role'
              find('#draft_metadata_lineage_0_date_1_responsibility_0_responsibility_organization').click
              mmt_fill_in init_store, 'Short Name', with: 'short_name'
            end
          end
        end
        click_on 'Add another Metadata Date'
        within '.multiple-item-1' do
          mmt_select init_store, 'Create', from: 'Date Type'
          mmt_fill_in init_store, 'Date', with: '2015-07-05'
          mmt_fill_in init_store, 'draft_metadata_lineage_1_date_0_description', with: 'Create metadata' #Description
          within '.multiple.responsibility' do
            mmt_select init_store, 'User', from: 'Role'
            find('#draft_metadata_lineage_1_date_0_responsibility_0_responsibility_organization').click
            mmt_fill_in init_store, 'Short Name', with: 'another_short_name'
          end

        end
      end
    end

    def add_contacts(init_store) #=[])
      within '.multiple.contact' do
        mmt_fill_in init_store, 'Type', with: 'Email'
        mmt_fill_in init_store, 'Value', with: 'example@example.com'
        click_on 'Add another Contact'
        within '.multiple-item-1' do
          mmt_fill_in init_store, 'Type', with: 'Email'
          mmt_fill_in init_store, 'Value', with: 'example2@example.com'
        end
      end
    end

    def add_addresses(init_store) #=[])
      within '.multiple.address' do
        within '.multiple.address-street-address' do
          # TODO - address how find bypasses init_store
          within first('.multiple-item') do
            find('input').set '300 E Street Southwest'
          end
          within all('.multiple-item').last do
            find('input').set 'Room 203'
          end
        end
        mmt_fill_in init_store, 'City', with: 'Washington'
        mmt_fill_in init_store, 'State / Province', with: 'DC'
        mmt_fill_in init_store, 'Postal Code', with: '20546'
        mmt_fill_in init_store, 'Country', with: 'United States'
        click_on 'Add another Address'
        within '.multiple-item-1' do
          within '.multiple.address-street-address' do
            within first('.multiple-item') do
              # TODO - address how find bypasses init_store
              find('input').set '8800 Greenbelt Road'
            end
          end
          mmt_fill_in init_store, 'City', with: 'Greenbelt'
          mmt_fill_in init_store, 'State / Province', with: 'MD'
          mmt_fill_in init_store, 'Postal Code', with: '20771'
          mmt_fill_in init_store, 'Country', with: 'United States'
        end
      end
    end

    def add_related_urls(init_store) #=[])
      within '.multiple.related-url' do
        within '.multiple.related-url-url' do
          mmt_fill_in init_store, 'URL', with: 'http://example.com'
          click_on 'Add another'
          within all('.multiple-item').last do
            mmt_fill_in init_store, 'URL', with: 'http://another-example.com'
          end
        end
        mmt_fill_in init_store, 'Description', with: 'Example Description'
        mmt_select init_store, 'FTP', from: 'Protocol'
        mmt_fill_in init_store, 'Mime Type', with: 'text/html'
        mmt_fill_in init_store, 'Caption', with: 'Example Caption'
        mmt_fill_in init_store, 'Title', with: 'Example Title'
        within '.file-size' do
          mmt_fill_in init_store, 'Size', with: '42'
          mmt_fill_in init_store, 'Unit', with: 'MB'
        end
        within '.content-type' do
          mmt_fill_in init_store, 'Type', with: 'Text'
          mmt_fill_in init_store, 'Subtype', with: 'Subtext'
        end

        # Add another RelatedUrl
        click_on 'Add another Related Url'

        within '.multiple-item-1' do
          within '.multiple.related-url-url' do
            mmt_fill_in init_store, 'URL', with: 'http://example.com/1'
            click_on 'Add another'
            within all('.multiple-item').last do
              mmt_fill_in init_store, 'URL', with: 'http://another-example.com/1'
            end
          end
          mmt_fill_in init_store, 'Description', with: 'Example Description 1'
          mmt_select init_store, 'SSH', from: 'Protocol'
          mmt_fill_in init_store, 'Mime Type', with: 'text/json'
          mmt_fill_in init_store, 'Caption', with: 'Example Caption 1'
          mmt_fill_in init_store, 'Title', with: 'Example Title 1'
          within '.file-size' do
            mmt_fill_in init_store, 'Size', with: '4.2'
            mmt_fill_in init_store, 'Unit', with: 'GB'
          end
          within '.content-type' do
            mmt_fill_in init_store, 'Type', with: 'Text 1'
            mmt_fill_in init_store, 'Subtype', with: 'Subtext 1'
          end
        end
      end
    end

  end
end

