module Helpers
  module UmmSDraftHelpers
    def add_contact_groups
      within '.multiple.contact-groups' do
        select 'TECHNICAL CONTACT', from: 'Roles'
        select 'SCIENCE CONTACT', from: 'Roles'
        fill_in 'Group Name', with: 'Group 1'
        fill_in 'Uuid', with: 'b1837851-91b3-4aa9-8e89-f805fae629c9'
        fill_in'Non Service Organization Affiliation', with: 'NonServiceOrganizationAffiliation Group 1'
        add_service_contact_information

        click_on 'Add another Contact Group'
      end
      within '.multiple.contact-groups > .multiple-item-1' do
        select 'SERVICE PROVIDER CONTACT', from: 'Roles'
        fill_in 'Group Name', with: 'Group 2'
      end
    end

    def add_contact_persons
      within '.multiple.contact-persons' do
        select 'SERVICE PROVIDER', from: 'Roles'
        fill_in 'First Name', with: 'First'
        fill_in 'Middle Name', with: 'Middle'
        fill_in 'Last Name', with: 'Last'
        fill_in 'Uuid', with: '39092bbc-97ec-41c3-ab85-e3e8cacf429a'
        fill_in 'Non Service Organization Affiliation', with: 'NonServiceOrganizationAffiliation Person 1'
        add_service_contact_information

        click_on 'Add another Contact Person'
      end
      within '.multiple.contact-persons > .multiple-item-1' do
        select 'DEVELOPER', from: 'Roles'
        fill_in 'Last Name', with: 'Last 2'
      end
    end

    def add_service_organizations
      within '.multiple.service-organizations > .multiple-item-0' do
        select 'DEVELOPER', from: 'Roles', match: :first
        select 'PUBLISHER', from: 'Roles', match: :first
        select 'AARHUS-HYDRO', from: 'Short Name'
        fill_in 'Uuid', with: '7b1ac64e-8bdd-45db-831b-994b13f60100', match: :first

        add_contact_groups
        add_contact_persons
        add_service_contact_information
      end
      click_on 'Add another Service Organization'
      within '.multiple.service-organizations > .multiple-item-1' do
        select 'AUTHOR', from: 'Roles', match: :first
        select 'ESA/ED', from: 'Short Name'
      end
    end

    def add_service_contact_information
      within all('.contact-information').last do
        fill_in 'Service Hours', with: '9-6, M-F'
        fill_in 'Contact Instruction', with: 'Email only'

        within '.multiple.contact-mechanisms' do
          within '.multiple-item-0' do
            select 'Email', from: 'Type'
            fill_in 'Value', with: 'example@example.com'
          end
          click_on 'Add another Contact Mechanism'
          within '.multiple-item-1' do
            select 'Email', from: 'Type'
            fill_in 'Value', with: 'example2@example.com'
          end
        end

        within '.multiple.addresses > .multiple-item-0' do
          select 'United States', from: 'Country'

          within '.multiple.street-addresses' do
            within '.multiple-item-0' do
              find('input').set('300 E Street Southwest')
            end
            within '.multiple-item-1' do
              find('input').set('Room 203')
            end
            within '.multiple-item-2' do
              find('input').set('Address line 3')
            end
          end

          fill_in 'City', with: 'Washington'
          fill_in 'State / Province', with: 'DC'
          fill_in 'Postal Code', with: '20546'
        end
        click_on 'Add another Address'
        within '.multiple.addresses > .multiple-item-1' do
          select 'United States', from: 'Country'

          within '.multiple.street-addresses' do
            within '.multiple-item-0' do
              find('input').set('8800 Greenbelt Road')
            end
          end

          fill_in 'City', with: 'Greenbelt'
          fill_in 'State / Province', with: 'MD'
          fill_in 'Postal Code', with: '20771'
        end

        within '.multiple.related-urls > .multiple-item-0' do
          fill_in 'Description', with: 'Related URL 1 Description'
          select 'Collection URL', from: 'Url Content Type'
          select 'Data Set Landing Page', from: 'Type'
          fill_in 'Url', with: 'http://example.com/'
        end
        click_on 'Add another Related Url'
        within '.multiple.related-urls> .multiple-item-1' do
          fill_in 'Description', with: 'Related URL 2 Description'
          select 'Distribution URL', from: 'Url Content Type'
          select 'Get Service', from: 'Type'
          select 'DIF', from: 'Subtype'
          fill_in 'Url', with: 'https://example.com/'

          select 'Not provided', from: 'Mime Type'
          select 'HTTPS', from: 'Protocol'
          fill_in 'Full Name', with: 'Service Name'
          fill_in 'Data ID', with: 'data_id'
          fill_in 'Data Type', with: 'data type'
          within '.multiple.uri' do
            find('input.uri').set('uri1')
            click_on 'Add another Uri'
            within '.multiple-item-1' do
              find('input.uri').set('uri2')
            end
          end
        end
        click_on 'Add another Related Url'
        within '.multiple.related-urls > .multiple-item-2' do
          fill_in 'Description', with: 'Related URL 3 Description'
          select 'Distribution URL', from: 'Url Content Type'
          select 'Get Data', from: 'Type'
          select 'Earthdata Search', from: 'Subtype'
          fill_in 'Url', with: 'https://search.earthdata.nasa.gov/'

          select 'ascii', from: 'Format'
          fill_in 'Size', with: '42'
          select 'KB', from: 'Unit'
          fill_in 'Fees', with: '0'
          fill_in 'Checksum', with: 'sdfgfgksghafgsdvbasf'
        end
      end
    end
  end
end
