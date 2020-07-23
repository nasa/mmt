describe 'Data Centers form' do
  context 'when creating a Data Center', js: true do
    before do
      login
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_collection_draft_path(draft, form: 'data_centers')
    end

    context 'when submitting the form' do
      before do

        within '.multiple.data-centers' do
          select 'Distributor', from: 'Role'
          select 'Processor', from: 'Role'

          add_data_center('AARHUS-HYDRO')
          add_contact_information(type: 'data_center', single: false, button_type: 'Data Center')

        end

        # for some reason `click_on 'Add another Data Center'` stopped working
        # with switch to headless chrome, as well as all the other find and click
        # methods even though previous 'Add another _' buttons work in this test.
        # Using jQuery allowed the button to be clicked
        button_script = "$('.add-another-data-center').click();"
        page.execute_script(button_script)

        within '#draft_data_centers_1' do
          select 'Originator', from: 'Role'
          add_data_center_with_retry('ESA/ED')
          add_contact_information(type: 'data_center', single: false, button_type: 'Data Center')
        end

        within '.nav-top' do
          click_on 'Save'

          wait_for_jQuery
        end

        open_accordions
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Updated Successfully!')
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
            expect(page).to have_field('URL Content Type', with: 'DataCenterURL')
            expect(page).to have_field('Type', with: 'HOME PAGE')
            expect(page).to have_field('URL', with: 'http://example.com')
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
            expect(page).to have_field('URL Content Type', with: 'DataCenterURL')
            expect(page).to have_field('Type', with: 'HOME PAGE')
            expect(page).to have_field('URL', with: 'http://www.esa.org/education/')
          end
        end
      end
    end
  end
end
