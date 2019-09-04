describe 'Saving Data Contacts and Data Centers', js: true do
  before do
    login
  end

  context 'when saving Data Contacts when Data Centers already exist' do
    before do
      draft = create(:collection_draft_all_required_fields, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)

      find('.tab-label', text: 'Additional Information').click
    end

    it 'has the Data Center on the preview page' do
      within '.data-centers-preview' do
        expect(page).to have_content('AARHUS-HYDRO')
        expect(page).to have_content('Hydrogeophysics Group, Aarhus University')
      end
    end

    context 'when adding a Non Data Center Contact' do
      before do
        click_on 'Data Contacts', match: :first

        select 'Non Data Center Contact Group', from: 'Data Contact Type'

        within '.multiple.data-contacts' do
          select 'Data Center Contact', from: 'Role'
          select 'User Services', from: 'Role'
          fill_in 'Group Name', with: 'NDC Group Name'
          fill_in 'Non Data Center Affiliation', with: 'Big Name Research Lab'
        end

        within '.nav-top' do
          click_on 'Done'
        end

        expect(page).to have_content('Metadata Fields')
        find('.tab-label', text: 'Additional Information').click
      end

      it 'displays the Data Contact on the preview page' do
        within '.data-contacts-preview' do
          expect(page).to have_content('NDC Group Name')
          expect(page).to have_content('Data Center Contact, User Services')
          expect(page).to have_content('Big Name Research Lab')
        end
      end

      it 'still displays the Data Center on the preview page' do
        within '.data-centers-preview' do
          expect(page).to have_content('AARHUS-HYDRO')
          expect(page).to have_content('Hydrogeophysics Group, Aarhus University')
        end
      end

      context 'when then adding another Data Center' do
        before do
          click_on 'Data Centers', match: :first

          expect(page).to have_content('Data Centers')
          click_on 'Add another Data Center'

          within '.multiple.data-centers > .multiple-item-1' do
            select 'Originator', from: 'Role'
            add_data_center('ESA/ED')
          end

          within '.nav-top' do
            click_on 'Done'
          end

          expect(page).to have_content('Metadata Fields')
          find('.tab-label', text: 'Additional Information').click
        end

        it 'displays both Data Centers on the preview page' do
          within '.data-centers-preview' do
            expect(page).to have_content('AARHUS-HYDRO')
            expect(page).to have_content('Hydrogeophysics Group, Aarhus University')

            expect(page).to have_content('ESA/ED')
            expect(page).to have_content('Educational Office, Ecological Society of America')
            expect(page).to have_content('ORIGINATOR')
          end
        end

        it 'still displays the Data Contact on the preview page' do
          within '.data-contacts-preview' do
            expect(page).to have_content('NDC Group Name')
            expect(page).to have_content('Data Center Contact, User Services')
            expect(page).to have_content('Big Name Research Lab')
          end
        end
      end

    end

    context 'when adding a Data Center Contact Person without Data Center Short Name' do
      before do
        click_on 'Data Contacts', match: :first

        select 'Data Center Contact Person', from: 'Data Contact Type'

        within '.multiple.data-contacts' do
          select 'Technical Contact', from: 'Role'
          fill_in 'First Name', with: 'Test First Name'
          fill_in 'Last Name', with: 'Test First Name'
        end

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'

        expect(page).to have_content('Metadata Fields')
        find('.tab-label', text: 'Additional Information').click
        click_on 'Data Centers', match: :first
        within '.multiple.data-centers > .multiple-item-1' do
          fill_in 'Service Hours', with: '9 - 5'
        end
        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'

        expect(page).to have_content('Metadata Fields')
        find('.tab-label', text: 'Additional Information').click
        save_screenshot '/tmp/2.png'
      end

      it 'displays the Data Contact on the preview page' do
        within '.data-contacts-preview' do
          expect(page).to have_content('Test First Name')
          expect(page).to have_content('Test First Name')
        end
      end
    end

  end
end
