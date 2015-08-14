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
            draft = map_value_onto_display_string(draft, role_options)
          elsif parent_key_special_handling == :handle_as_duration
            # Map duration value stored in json to what is actually supposed to be displayed
            draft = map_value_onto_display_string(draft, duration_options)
          elsif parent_key_special_handling == :handle_as_not_shown
            # This field is present in json, but intentionally not displayed
            return
          elsif parent_key_special_handling == :handle_as_date_type
            # Map date type stored in json to what is actually supposed to be displayed
            draft = map_value_onto_display_string(draft, date_type_options)
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

    def add_organization
      fill_in 'Short Name', with: 'ORG_SHORT'
      fill_in 'Long Name', with: 'Organization Long Name'
    end

    def add_person
      fill_in 'First Name', with: 'First Name'
      fill_in 'Middle Name', with: 'Middle Name'
      fill_in 'Last Name', with: 'Last Name'
    end

    def add_responsibilities(type=nil)
      within '.multiple.responsibility' do
        select 'Resource Provider', from: 'Role'
        case type
        when 'organization'
          add_organization
        when 'personnel'
          add_person
        else
          find(".responsibility-picker.organization").click
          add_organization
        end

        fill_in 'Service Hours', with: '9-5, M-F'
        fill_in 'Contact Instructions', with: 'Email only'

        add_contacts
        add_addresses
        add_related_urls

        click_on 'Add another Responsibility'
        within '.multiple-item-1' do
          select 'Owner', from: 'Role'
          case type
          when 'organization'
            add_organization
          when 'personnel'
            add_person
          else
            find(".responsibility-picker.person").click
            add_person
          end

          fill_in 'Service Hours', with: '10-2, M-W'
          fill_in 'Contact Instructions', with: 'Email only'

          add_contacts
          add_addresses
          add_related_urls
        end
      end
    end

    def add_dates(prefix = nil)
      within ".multiple.#{prefix}data-lineage" do
        within ".multiple.#{prefix}data-lineage-date" do
          select 'Create', from: 'Date Type'
          fill_in 'Date', with: '2015-07-01'
          fill_in "draft_#{prefix}data_lineage_0_date_0_description", with: "Create #{prefix}data" #Description

          add_responsibilities

          click_on 'Add another Date'
          within '.multiple-item-1' do
            select 'Review', from: 'Date Type'
            fill_in 'Date', with: '2015-07-02'
            fill_in "draft_#{prefix}data_lineage_0_date_1_description", with: "Reviewed #{prefix}data" #Description
            within '.multiple.responsibility' do
              select 'Editor', from: 'Role'
              find(".responsibility-picker.organization").click
              fill_in 'Short Name', with: 'short_name'
            end
          end
        end
        click_on "Add another #{prefix.nil? ? 'Data' : 'Metadata'} Date"
        within '.multiple-item-1' do
          select 'Create', from: 'Date Type'
          fill_in 'Date', with: '2015-07-05'
          fill_in "draft_#{prefix}data_lineage_1_date_0_description", with: "Create #{prefix}data" #Description
          within '.multiple.responsibility' do
            select 'User', from: 'Role'
            find(".responsibility-picker.organization").click
            fill_in 'Short Name', with: 'another_short_name'
          end
        end
      end
    end

    def add_contacts
      within '.multiple.contact' do
        fill_in 'Type', with: 'Email'
        fill_in 'Value', with: 'example@example.com'
        click_on 'Add another Contact'
        within '.multiple-item-1' do
          fill_in 'Type', with: 'Email'
          fill_in 'Value', with: 'example2@example.com'
        end
      end
    end

    def add_addresses
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
        fill_in 'City', with: 'Washington'
        fill_in 'State / Province', with: 'DC'
        fill_in 'Postal Code', with: '20546'
        fill_in 'Country', with: 'United States'
        click_on 'Add another Address'
        within '.multiple-item-1' do
          within '.multiple.address-street-address' do
            within first('.multiple-item') do
              # TODO - address how find bypasses init_store
              find('input').set '8800 Greenbelt Road'
            end
          end
          fill_in 'City', with: 'Greenbelt'
          fill_in 'State / Province', with: 'MD'
          fill_in 'Postal Code', with: '20771'
          fill_in 'Country', with: 'United States'
        end
      end
    end

    def add_related_urls(single=nil)
      within "#{'.multiple' unless single}.related-url" do
        within '.multiple.related-url-url' do
          fill_in 'URL', with: 'http://example.com'
          click_on 'Add another'
          within all('.multiple-item').last do
            fill_in 'URL', with: 'http://another-example.com'
          end
        end
        fill_in 'Description', with: 'Example Description'
        select 'FTP', from: 'Protocol'
        fill_in 'Mime Type', with: 'text/html'
        fill_in 'Caption', with: 'Example Caption'
        fill_in 'Title', with: 'Example Title'
        within '.file-size' do
          fill_in 'Size', with: '42'
          fill_in 'Unit', with: 'MB'
        end
        within '.content-type' do
          fill_in 'Type', with: 'Type'
          fill_in 'Subtype', with: 'Subtype'
        end

        unless single
          # Add another RelatedUrl
          click_on 'Add another Related Url'

          within '.multiple-item-1' do
            within '.multiple.related-url-url' do
              fill_in 'URL', with: 'http://example.com/1'
            end
          end
        end
      end
    end

    def add_resource_citation
      within '.multiple.resource-citation' do
        fill_in 'Version', with: 'v1'
        fill_in "draft_collection_citation_0_title", with: "Citation title" #Title
        fill_in 'Creator', with: 'Citation creator'
        fill_in 'Editor', with: 'Citation editor'
        fill_in 'Series Name', with: 'Citation series name'
        fill_in 'Release Date', with: '2015-07-01T00:00:00Z'
        fill_in 'Release Place', with: 'Citation release place'
        fill_in 'Publisher', with: 'Citation publisher'
        fill_in 'Issue Identification', with: 'Citation issue identification'
        fill_in 'Data Presentation Form', with: 'Citation data presentation form'
        fill_in 'Other Citation Details', with: 'Citation other details'
        fill_in 'DOI', with: 'Citation DOI'
        fill_in 'Authority', with: 'Citation DOI Authority'
        add_related_urls(true)

        click_on 'Add another Resource Citation'
        within '.multiple-item-1' do
          fill_in 'Version', with: 'v2'
          fill_in "draft_collection_citation_1_title", with: "Citation title 1" #Title
          fill_in 'Creator', with: 'Citation creator 1'
          add_related_urls(true)
        end

      end
    end

    def add_metadata_association
      within '.multiple.metadata-association' do
        select 'Science Associated', from: 'Type'
        fill_in 'Description', with: 'Metadata association description'
        fill_in 'ID', with: '12345'
        fill_in 'Version', with: 'v1'
        fill_in 'Authority', with: 'Authority'
        select 'LPDAAC_ECS', from: 'Provider ID'
        click_on 'Add another Metadata Association'
        within '.multiple-item-1' do
          select 'Larger Citation Works', from: 'Type'
          fill_in 'ID', with: '123abc'
          select 'ORNL_DAAC', from: 'Provider ID'
        end
      end
    end

    def add_publication_reference
      within '.multiple.publication-reference' do
        fill_in "draft_publication_reference_0_title", with: "Publication reference title" #Title
        fill_in 'Publisher', with: 'Publication reference publisher'
        fill_in 'DOI', with: 'Publication reference DOI'
        fill_in 'Authority', with: 'Publication reference authority'
        fill_in 'Author', with: 'Publication reference author'
        fill_in 'Publication Date', with: '2015-07-01T00:00:00Z'
        fill_in 'Series', with: 'Publication reference series'
        fill_in 'Edition', with: 'Publication reference edition'
        fill_in 'Volume', with: 'Publication reference volume'
        fill_in 'Issue', with: 'Publication reference issue'
        fill_in 'Report Number', with: 'Publication reference report number'
        fill_in 'Publication Place', with: 'Publication reference publication place'
        fill_in 'Pages', with: 'Publication reference pages'
        fill_in 'ISBN', with: '1234567890123'
        fill_in 'Other Reference Details', with: 'Publication reference details'
        add_related_urls(true)

        click_on 'Add another Publication Reference'
        within '.multiple-item-1' do
          fill_in "draft_publication_reference_1_title", with: "Publication reference title 1" #Title
          fill_in 'ISBN', with: '9876543210987'
        end
      end
    end

  end
end
