# MMT-381

require 'rails_helper'

describe 'Organizations form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Organizations', match: :first
      end

      # Organization
      within '#organizations' do
        add_responsibilities('organizations')
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it 'shows pre-entered values in the draft preview page' do
      within '.preview' do
        expect(page).to have_content('Resource Provider')
        expect(page).to have_content('ORG_SHORT')
        expect(page).to have_content('Organization Long Name')
        expect(page).to have_content('9-5, M-F')
        expect(page).to have_content('Email only')

        expect(page).to have_content('Email')
        expect(page).to have_content('example@example.com')

        expect(page).to have_content('Email')
        expect(page).to have_content('example2@example.com')

        expect(page).to have_content('300 E Street Southwest')
        expect(page).to have_content('Room 203')
        expect(page).to have_content('Address line 3')
        expect(page).to have_content('Washington')
        expect(page).to have_content('District of Columbia')
        expect(page).to have_content('20546')
        expect(page).to have_content('United States')

        expect(page).to have_content('8800 Greenbelt Road')
        expect(page).to have_content('Greenbelt')
        expect(page).to have_content('Maryland')
        expect(page).to have_content('20771')
        expect(page).to have_content('United States')

        expect(page).to have_content('http://example.com')
        expect(page).to have_content('http://another-example.com')
        expect(page).to have_content('Example Description')
        expect(page).to have_content('text/html')
        expect(page).to have_content('Example Title')
        expect(page).to have_content('42.0')
        expect(page).to have_content('MB')

        expect(page).to have_content('http://example.com/1')

        expect(page).to have_content('Owner')
        expect(page).to have_content('ORG_SHORT')
        expect(page).to have_content('Organization Long Name')
        expect(page).to have_content('10-2, M-W')
        expect(page).to have_content('Email only')

        expect(page).to have_content('Email')
        expect(page).to have_content('example@example.com')

        expect(page).to have_content('Email')
        expect(page).to have_content('example2@example.com')

        expect(page).to have_content('300 E Street Southwest')
        expect(page).to have_content('Room 203')
        expect(page).to have_content('Address line 3')
        expect(page).to have_content('Washington')
        expect(page).to have_content('District of Columbia')
        expect(page).to have_content('20546')
        expect(page).to have_content('United States')

        expect(page).to have_content('8800 Greenbelt Road')
        expect(page).to have_content('Greenbelt')
        expect(page).to have_content('Maryland')
        expect(page).to have_content('20771')
        expect(page).to have_content('United States')

        expect(page).to have_content('http://example.com')
        expect(page).to have_content('http://another-example.com')
        expect(page).to have_content('Example Description')
        expect(page).to have_content('text/html')
        expect(page).to have_content('Example Title')
        expect(page).to have_content('42.0')
        expect(page).to have_content('MB')

        expect(page).to have_content('http://example.com/1')
      end

      expect(page).to have_content('No Temporal Coverages found')
      expect(page).to have_content('No Spatial Coordinates found')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Organizations', match: :first
        end
      end

      it 'populates the form with the values' do
        #### Organizations
        within '.multiple.organizations > .multiple-item-0' do
          expect(page).to have_field('Role', with: 'RESOURCEPROVIDER')
          expect(page).to have_field('Short Name', with: 'ORG_SHORT')
          expect(page).to have_field('Long Name', with: 'Organization Long Name')
          expect(page).to have_field('Service Hours', with: '9-5, M-F')
          expect(page).to have_field('Contact Instructions', with: 'Email only')
          within '.multiple.contacts' do
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
            expect(page).to have_selector('input.street-address[value="300 E Street Southwest"]')
            expect(page).to have_selector('input.street-address[value="Room 203"]')
            expect(page).to have_selector('input.street-address[value="Address line 3"]')
            expect(page).to have_field('City', with: 'Washington')
            expect(page).to have_field('State / Province', with: 'District of Columbia')
            expect(page).to have_field('Postal Code', with: '20546')
            expect(page).to have_field('Country', with: 'United States')
          end
          within '.multiple.addresses > .multiple-item-1' do
            expect(page).to have_selector('input.street-address[value="8800 Greenbelt Road"]')
            expect(page).to have_field('City', with: 'Greenbelt')
            expect(page).to have_field('State / Province', with: 'Maryland')
            expect(page).to have_field('Postal Code', with: '20771')
            expect(page).to have_field('Country', with: 'United States')
          end
          within '.multiple.related-urls > .multiple-item-0' do
            expect(page).to have_selector('input.url[value="http://example.com"]')
            expect(page).to have_selector('input.url[value="http://another-example.com"]')
            expect(page).to have_field('Description', with: 'Example Description')
            expect(page).to have_field('Mime Type', with: 'text/html')
            expect(page).to have_field('Title', with: 'Example Title')
            expect(page).to have_field('Size', with: '42.0')
            expect(page).to have_field('Unit', with: 'MB')
          end
          within '.multiple.related-urls> .multiple-item-1' do
            expect(page).to have_selector('input.url[value="http://example.com/1"]')
          end
        end
        within '.multiple.organizations > .multiple-item-1' do
          expect(page).to have_field('Role', with: 'OWNER')
          expect(page).to have_field('Short Name', with: 'ORG_SHORT')
          expect(page).to have_field('Long Name', with: 'Organization Long Name')
          expect(page).to have_field('Service Hours', with: '10-2, M-W')
          expect(page).to have_field('Contact Instructions', with: 'Email only')
          within '.multiple.contacts' do
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
            expect(page).to have_selector('input.street-address[value="300 E Street Southwest"]')
            expect(page).to have_selector('input.street-address[value="Room 203"]')
            expect(page).to have_selector('input.street-address[value="Address line 3"]')
            expect(page).to have_field('City', with: 'Washington')
            expect(page).to have_field('State / Province', with: 'District of Columbia')
            expect(page).to have_field('Postal Code', with: '20546')
            expect(page).to have_field('Country', with: 'United States')
          end
          within '.multiple.addresses > .multiple-item-1' do
            expect(page).to have_selector('input.street-address[value="8800 Greenbelt Road"]')
            expect(page).to have_field('City', with: 'Greenbelt')
            expect(page).to have_field('State / Province', with: 'Maryland')
            expect(page).to have_field('Postal Code', with: '20771')
            expect(page).to have_field('Country', with: 'United States')
          end
          within '.multiple.related-urls > .multiple-item-0' do
            expect(page).to have_selector('input.url[value="http://example.com"]')
            expect(page).to have_selector('input.url[value="http://another-example.com"]')
            expect(page).to have_field('Description', with: 'Example Description')
            expect(page).to have_field('Mime Type', with: 'text/html')
            expect(page).to have_field('Title', with: 'Example Title')
            expect(page).to have_field('Size', with: '42.0')
            expect(page).to have_field('Unit', with: 'MB')
          end
          within '.multiple.related-urls> .multiple-item-1' do
            expect(page).to have_selector('input.url[value="http://example.com/1"]')
          end
        end
      end
    end
  end
end
