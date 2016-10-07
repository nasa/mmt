require 'rails_helper'

describe 'Data Contacts form filling in Non Data Center Contacts', js: true do
  before do
    login
  end

  context 'when creating Non Data Center Contacts' do
    before do
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    context 'when choosing Non Data Center Contact Group' do
      before do
        click_on 'Data Contacts', match: :first

        page.document.synchronize do
          select 'Non Data Center Contact Group', from: 'Data Contact Type'
        end
      end

      it 'displays the Non Data Center Affiliation field' do
        expect(page).to have_field 'Non Data Center Affiliation'
      end

      context 'when submitting the form' do
        before do
          within '.multiple.data-contacts' do
            select 'Data Center Contact', from: 'Role'
            select 'User Services', from: 'Role'
            fill_in 'Group Name', with: 'NDC Group Name'
            fill_in 'Non Data Center Affiliation', with: 'Big Name Research Lab'

            add_contact_information('data_contact', false, 'Non Data Center Contact Group')
          end

          within '.nav-top' do
            click_on 'Save'
          end

          expect(page).to have_content('Data Contacts')
          open_accordions
        end

        it 'displays a confirmation message' do
          expect(page).to have_content('Draft was successfully updated')
        end

        it 'populates the form with the values' do
          wait_for_jQuery(30)
          page.document.synchronize do
            within '.multiple.data-contacts > .multiple-item-0' do
              expect(page).to have_select('Role', selected: ['Data Center Contact', 'User Services'])
              expect(page).to have_field('Group Name', with: 'NDC Group Name')
              expect(page).to have_field('Non Data Center Affiliation', with: 'Big Name Research Lab')
              expect(page).to have_field('Service Hours', with: '9-5, M-F')
              expect(page).to have_field('Contact Instructions', with: 'Email only')
              within '.multiple.contact-mechanisms' do
                expect(page).to have_field('Type', with: 'Email') # ask for 2 matches?
                expect(page).to have_field('Value', with: 'example@example.com')
                expect(page).to have_field('Value', with: 'example2@example.com')
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
                expect(page).to have_selector('input.url[value="http://example.com"]')
                expect(page).to have_selector('input.url[value="http://another-example.com"]')
                expect(page).to have_field('Description', with: 'Example Description')
                expect(page).to have_field('Title', with: 'Example Title')
              end
            end
          end
        end

        it 'saves the contact group in the right structure in the schema' do
          wait_for_jQuery
          page.document.synchronize do
            d = Draft.first
            expect(d.draft['ContactGroups'].count).to eq(1)
            contact_group = d.draft['ContactGroups'].first
            expect(contact_group['GroupName']).to eq('NDC Group Name')
            expect(contact_group['NonDataCenterAffiliation']).to eq('Big Name Research Lab')
          end
        end
      end
    end

    context 'when choosing Non Data Center Contact Person' do
      before do
        click_on 'Data Contacts', match: :first

        select 'Non Data Center Contact Person', from: 'Data Contact Type'
      end

      it 'displays the Non Data Center Affiliation field' do
        expect(page).to have_field 'Non Data Center Affiliation'
      end

      context 'when submitting the form' do
        before do
          within '.multiple.data-contacts' do
            select 'Investigator', from: 'Role'
            select 'Technical Contact', from: 'Role'
            add_person
            fill_in 'Non Data Center Affiliation', with: 'Big Name Research Lab'

            add_contact_information('data_contact', false, 'Non Data Center Contact Person')
          end

          within '.nav-top' do
            click_on 'Save'
          end

          expect(page).to have_content('Data Contacts')
          open_accordions
        end

        it 'displays a confirmation message'do
          expect(page).to have_content('Draft was successfully updated')
        end

        it 'populates the form with the values' do
          wait_for_jQuery(30)
          page.document.synchronize do
            within '.multiple.data-contacts > .multiple-item-0' do
              expect(page).to have_select('Role', selected: ['Investigator', 'Technical Contact'])
              expect(page).to have_field('First Name', with: 'First Name')
              expect(page).to have_field('Middle Name', with: 'Middle Name')
              expect(page).to have_field('Last Name', with: 'Last Name')
              expect(page).to have_field('Non Data Center Affiliation', with: 'Big Name Research Lab')
              expect(page).to have_field('Service Hours', with: '9-5, M-F')
              expect(page).to have_field('Contact Instructions', with: 'Email only')
              within '.multiple.contact-mechanisms' do
                expect(page).to have_field('Type', with: 'Email') # ask for 2 matches?
                expect(page).to have_field('Value', with: 'example@example.com')
                expect(page).to have_field('Value', with: 'example2@example.com')
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
                expect(page).to have_selector('input.url[value="http://example.com"]')
                expect(page).to have_selector('input.url[value="http://another-example.com"]')
                expect(page).to have_field('Description', with: 'Example Description')
                expect(page).to have_field('Title', with: 'Example Title')
              end
            end
          end
        end

        it 'saves the data in the right structure in the schema' do
          wait_for_jQuery
          page.document.synchronize do
            d = Draft.first
            expect(d.draft['ContactPersons'].count).to eq(1)

            contact_person = d.draft['ContactPersons'].first
            expect(contact_person['FirstName']).to eq('First Name')
            expect(contact_person['MiddleName']).to eq('Middle Name')
            expect(contact_person['LastName']).to eq('Last Name')
            expect(contact_person['NonDataCenterAffiliation']).to eq('Big Name Research Lab')
          end
        end
      end
    end
  end
end
