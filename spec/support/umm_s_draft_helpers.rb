module Helpers
  module UmmSDraftHelpers
    def add_service_contact_groups
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UmmSDraftHelpers#add_service_contact_groups' do
        within '.multiple.contact-groups' do
          select 'TECHNICAL CONTACT', from: 'Roles'
          select 'SCIENCE CONTACT', from: 'Roles'
          fill_in 'Group Name', with: 'Group 1'
          add_service_contact_information

          click_on 'Add another Contact Group'
        end
        within '.multiple.contact-groups > .multiple-item-1' do
          select 'SERVICE PROVIDER CONTACT', from: 'Roles'
          fill_in 'Group Name', with: 'Group 2'
        end
      end
    end

    def add_service_contact_persons
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UmmSDraftHelpers#add_service_contact_persons' do
        within '.multiple.contact-persons' do
          select 'SERVICE PROVIDER', from: 'Roles'
          fill_in 'First Name', with: 'First'
          fill_in 'Middle Name', with: 'Middle'
          fill_in 'Last Name', with: 'Last'
          add_service_contact_information

          click_on 'Add another Contact Person'
        end
        within '.multiple.contact-persons > .multiple-item-1' do
          select 'DEVELOPER', from: 'Roles'
          fill_in 'Last Name', with: 'Last 2'
        end
      end
    end

    def add_service_organizations
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UmmSDraftHelpers#add_service_organizations' do
        within '.multiple.service-organizations > .multiple-item-0' do
          select 'DEVELOPER', from: 'Roles', match: :first
          select 'PUBLISHER', from: 'Roles', match: :first
          select 'AARHUS-HYDRO', from: 'Short Name'
        end

        click_on 'Add another Service Organization'
        within '.multiple.service-organizations > .multiple-item-1' do
          select 'DEVELOPER', from: 'Roles', match: :first
          select 'PUBLISHER', from: 'Roles', match: :first
          select 'AARHUS-HYDRO', from: 'Short Name'
          within '.online-resource' do
            fill_in 'Name', with: 'ORN Text'
            fill_in 'Protocol', with: 'ORP Text'
            fill_in 'Linkage', with: 'ORL Text'
            fill_in 'Description', with: 'ORD Text'
            fill_in 'Application Profile', with: 'ORAP Text'
            fill_in 'Function', with: 'ORF Text'
          end
        end
      end
    end

    def add_service_contact_information
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UmmSDraftHelpers#add_service_contact_information' do
        within all('.contact-information').first do
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
            select 'Publication URL', from: 'Url Content Type'
            select 'View Related Information', from: 'Type'
            select 'Read Me', from: 'Subtype'
            fill_in 'Url', with: 'https://example.com/'
          end
          click_on 'Add another Related Url'
          within '.multiple.related-urls > .multiple-item-2' do
            fill_in 'Description', with: 'Related URL 3 Description'
            select 'Visualization URL', from: 'Url Content Type'
            select 'Get Related Visualization', from: 'Type'
            select 'GIOVANNI', from: 'Subtype'
            fill_in 'Url', with: 'https://search.earthdata.nasa.gov/'
          end
        end
      end
    end
  end
end
