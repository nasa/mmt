require 'rails_helper'

describe 'Data Centers form' do
  context 'when creating a Data Center', js: true do
    before do
      login
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    context 'when submitting the form' do
      before do
        within '#data-centers .meta-info' do
          click_link 'Data Centers', match: :first
        end

        within '.multiple.data-centers' do
          select 'Distributor', from: 'Role'
          select 'Processor', from: 'Role'

          add_data_center('AARHUS-HYDRO')
          add_contact_information('data_center', false, 'Data Center')

          click_on 'Add another Data Center'
          within '.multiple-item.eui-accordion.multiple-item-1' do
            select 'Originator', from: 'Role'
            add_data_center('ESA/ED')
            add_contact_information('data_center', false, 'Data Center')
          end
        end

        within '.nav-top' do
          click_on 'Save'

          wait_for_jQuery
        end

        open_accordions
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      it 'populates the form with the values' do
        within '.multiple.data-centers > .multiple-item-0' do
          expect(page).to have_select('Role', selected: %w(Distributor Processor))
          expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
          expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)
          expect(page).to have_field('Service Hours', with: '9-5, M-F')
          expect(page).to have_field('Contact Instructions', with: 'Email only')
          within '.multiple.contact-mechanisms' do
            within '.multiple-item-0' do
              expect(page).to have_field('Type', with: 'Email')
              expect(page).to have_field('Value', with: 'example@example.com')
            end
            within '.multiple-item-1' do
              expect(page).to have_field('Type', with: 'Email')
              expect(page).to have_field('Value', with: 'example2@example.com')
            end
          end

          within '.multiple.addresses > .multiple-item-0' do
            expect(page).to have_field('Street Address - Line 1', with: '300 E Street Southwest')
            expect(page).to have_field('Street Address - Line 2', with: 'Room 203')
            expect(page).to have_field('Street Address - Line 3', with: 'Address line 3')
            expect(page).to have_field('City', with: 'Washington')
            expect(page).to have_field('State / Province', with: 'District of Columbia')
            expect(page).to have_field('Postal Code', with: '20546')
            expect(page).to have_field('Country', with: 'United States')
          end

          within '.multiple.addresses > .multiple-item-1' do
            expect(page).to have_field('Street Address - Line 1', with: '8800 Greenbelt Road')
            expect(page).to have_field('City', with: 'Greenbelt')
            expect(page).to have_field('State / Province', with: 'Maryland')
            expect(page).to have_field('Postal Code', with: '20771')
            expect(page).to have_field('Country', with: 'United States')
          end

          within '.multiple.related-urls > .multiple-item-0' do
            expect(page).to have_field('Description', with: 'Example Description')
            expect(page).to have_field('URL Content Type', with: 'CollectionURL')
            expect(page).to have_field('Type', with: 'DATA SET LANDING PAGE')
            expect(page).to have_field('URL', with: 'http://example.com')
          end

          within '.multiple.related-urls> .multiple-item-1' do
            expect(page).to have_field('Description', with: 'Example Description 2')
            expect(page).to have_field('URL Content Type', with: 'DistributionURL')
            expect(page).to have_field('Type', with: 'GET SERVICE')
            expect(page).to have_field('Subtype', with: 'EARTHDATA SEARCH')
            expect(page).to have_field('URL', with: 'https://search.earthdata.nasa.gov')

            expect(page).to have_field('Mime Type', with: 'Not provided')
            expect(page).to have_field('Protocol', with: 'HTTPS')
            expect(page).to have_field('Full Name', with: 'Service name')
            expect(page).to have_field('Data ID', with: 'data id')
            expect(page).to have_field('Data Type', with: 'data type')
            expect(page).to have_selector('input.uri[value="uri1"]')
            expect(page).to have_selector('input.uri[value="uri2"]')
          end
        end

        within '.multiple.data-centers > .multiple-item-1' do
          expect(page).to have_select('Role', selected: ['Originator'])
          expect(page).to have_field('Short Name', with: 'ESA/ED')
          expect(page).to have_field('Long Name', with: 'Educational Office, Ecological Society of America', readonly: true)
          expect(page).to have_field('Service Hours', with: '9-5, M-F')
          expect(page).to have_field('Contact Instructions', with: 'Email only')
          within '.multiple.contact-mechanisms' do
            within '.multiple-item-0' do
              expect(page).to have_field('Type', with: 'Email')
              expect(page).to have_field('Value', with: 'example@example.com')
            end

            within '.multiple-item-1' do
              expect(page).to have_field('Type', with: 'Email')
              expect(page).to have_field('Value', with: 'example2@example.com')
            end
          end

          within '.multiple.addresses > .multiple-item-0' do
            expect(page).to have_field('Street Address - Line 1', with: '300 E Street Southwest')
            expect(page).to have_field('Street Address - Line 2', with: 'Room 203')
            expect(page).to have_field('Street Address - Line 3', with: 'Address line 3')
            expect(page).to have_field('City', with: 'Washington')
            expect(page).to have_field('State / Province', with: 'District of Columbia')
            expect(page).to have_field('Postal Code', with: '20546')
            expect(page).to have_field('Country', with: 'United States')
          end

          within '.multiple.addresses > .multiple-item-1' do
            expect(page).to have_field('Street Address - Line 1', with: '8800 Greenbelt Road')
            expect(page).to have_field('City', with: 'Greenbelt')
            expect(page).to have_field('State / Province', with: 'Maryland')
            expect(page).to have_field('Postal Code', with: '20771')
            expect(page).to have_field('Country', with: 'United States')
          end

          within '.multiple.related-urls > .multiple-item-0' do
            expect(page).to have_field('Description', with: 'Example Description')
            expect(page).to have_field('URL Content Type', with: 'CollectionURL')
            expect(page).to have_field('Type', with: 'DATA SET LANDING PAGE')
            expect(page).to have_field('URL', with: 'http://example.com')
          end

          within '.multiple.related-urls> .multiple-item-1' do
            expect(page).to have_field('Description', with: 'Example Description 2')
            expect(page).to have_field('URL Content Type', with: 'DistributionURL')
            expect(page).to have_field('Type', with: 'GET SERVICE')
            expect(page).to have_field('Subtype', with: 'EARTHDATA SEARCH')
            expect(page).to have_field('URL', with: 'https://search.earthdata.nasa.gov')

            expect(page).to have_field('Mime Type', with: 'Not provided')
            expect(page).to have_field('Protocol', with: 'HTTPS')
            expect(page).to have_field('Full Name', with: 'Service name')
            expect(page).to have_field('Data ID', with: 'data id')
            expect(page).to have_field('Data Type', with: 'data type')
            expect(page).to have_selector('input.uri[value="uri1"]')
            expect(page).to have_selector('input.uri[value="uri2"]')
          end
        end
      end
    end
  end
end
