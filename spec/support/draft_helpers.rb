module Helpers
  module DraftHelpers
    def create_new_draft
      visit '/dashboard'
      choose 'New Collection Record'
      click_on 'Create Record'
    end

    def add_metadata_dates_values
      within '.multiple.metadata-lineage' do
        within '.multiple.metadata-lineage-date' do
          select 'Create', from: 'Date Type'
          fill_in 'Date', with: '2015-07-01'
          fill_in 'draft_metadata_lineage_0_date_0_description', with: 'Create metadata' #Description

          within '.multiple.responsibility' do

            select 'Resource Provider', from: 'Role'
            find('#draft_metadata_lineage_0_date_0_responsibility_0_responsibility_organization').click
            fill_in 'Short Name', with: 'ORG_SHORT'
            fill_in 'Long Name', with: 'Organization Long Name'

            fill_in 'Service Hours', with: '9-5, M-F'
            fill_in 'Contact Instructions', with: 'Email only'

            add_contacts
            add_addresses
            add_related_urls

            click_on 'Add another Responsibility'
            within '.multiple-item-1' do
              select 'Owner', from: 'Role'
              find('#draft_metadata_lineage_0_date_0_responsibility_1_responsibility_person').click

              fill_in 'First Name', with: 'First Name'
              fill_in 'Middle Name', with: 'Middle Name'
              fill_in 'Last Name', with: 'Last Name'

              fill_in 'Service Hours', with: '10-2, M-W'
              fill_in 'Contact Instructions', with: 'Email only'

              add_contacts
              add_addresses
              add_related_urls
            end

          end

          click_on 'Add another Date'
          within '.multiple-item-1' do
            select 'Review', from: 'Date Type'
            fill_in 'Date', with: '2015-07-02'
            fill_in 'draft_metadata_lineage_0_date_1_description', with: 'Reviewed metadata' #Description
            within '.multiple.responsibility' do
              select 'Editor', from: 'Role'
              find('#draft_metadata_lineage_0_date_1_responsibility_0_responsibility_organization').click
              fill_in 'Short Name', with: 'short_name'
            end
          end
        end
        click_on 'Add another Metadata Date'
        within '.multiple-item-1' do
          select 'Create', from: 'Date Type'
          fill_in 'Date', with: '2015-07-05'
          fill_in 'draft_metadata_lineage_1_date_0_description', with: 'Create metadata' #Description
          within '.multiple.responsibility' do
            select 'User', from: 'Role'
            find('#draft_metadata_lineage_1_date_0_responsibility_0_responsibility_organization').click
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

    def add_related_urls
      within '.multiple.related-url' do
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
          fill_in 'Type', with: 'Text'
          fill_in 'Subtype', with: 'Subtext'
        end

        # Add another RelatedUrl
        click_on 'Add another Related Url'

        within '.multiple-item-1' do
          within '.multiple.related-url-url' do
            fill_in 'URL', with: 'http://example.com/1'
            click_on 'Add another'
            within all('.multiple-item').last do
              fill_in 'URL', with: 'http://another-example.com/1'
            end
          end
          fill_in 'Description', with: 'Example Description 1'
          select 'SSH', from: 'Protocol'
          fill_in 'Mime Type', with: 'text/json'
          fill_in 'Caption', with: 'Example Caption 1'
          fill_in 'Title', with: 'Example Title 1'
          within '.file-size' do
            fill_in 'Size', with: '4.2'
            fill_in 'Unit', with: 'GB'
          end
          within '.content-type' do
            fill_in 'Type', with: 'Text 1'
            fill_in 'Subtype', with: 'Subtext 1'
          end
        end
      end
    end

  end
end
