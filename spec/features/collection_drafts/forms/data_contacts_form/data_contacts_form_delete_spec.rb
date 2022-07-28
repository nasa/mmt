describe 'Collection Draft editing',js: true do
  before do
    login
  end

  context 'when adding a data contact' do
    before do
      visit new_collection_draft_path
      select('Data Contacts', from: 'next-section-top')
      click_link 'invalid-draft-accept'

      select('Data Center Contact Person', from: 'draft_data_contacts_0_data_contact_type')
      select('AARHUS-HYDRO', from: 'draft_data_contacts_0_contact_person_data_center_short_name')
      fill_in 'draft_data_contacts_0_contact_person_data_center_contact_person_first_name', with: 'Little Johnny'
      fill_in 'draft_data_contacts_0_contact_person_data_center_contact_person_last_name', with: 'Drop Tables'

      within '.nav-top' do
        click_on 'Done'
      end
      click_link 'invalid-draft-accept'
    end

    # Verifying explicitly that the entry has data.
    it 'has a data contact in the data center' do
      expect(page).to have_content('Little Johnny')
      expect(page).to have_content('Drop Tables')
    end

    context 'when editing a data contact' do
      before do
        visit collection_draft_path(CollectionDraft.first)
        click_on 'Data Contacts'
      end

      # Find the remove 'button' in the data-contact, and not other places.
      it 'can remove the only data contact' do
        within '.data-contacts > .multiple-item-0 > .eui-accordion__header > .actions' do
          expect(page).to have_css('a.remove')
        end
      end

      # Look in addresses and do not find a remove 'button'
      it 'cannot remove the only address' do
        within '.addresses > .multiple-item-0' do
          expect(page).to have_no_css('a.remove')
        end
      end

      context 'when saving the removal of the only contact' do
        before do
          within '.data-contacts > .multiple-item-0 > .eui-accordion__header > .actions' do
            find('a.remove', match: :first).click
          end
          within '.nav-top' do
            click_on 'Done'
          end
        end

        it 'saves the data center' do
          expect(page).to have_content('AARHUS-HYDRO')
        end

        it 'saves the removal of the data contact' do
          expect(page).to have_no_content('Little Johnny Drop Tables')
        end
      end

      context 'when continuing to edit the last data contact' do
        before do
          select('United States', from: 'draft_data_contacts_0_contact_person_data_center_contact_person_contact_information_addresses_0_country')
          within '.related-urls' do
            find('.add-new').click
          end

          within '.data-contacts > .multiple-item-0 > .eui-accordion__header > .actions' do
            find('a.remove', match: :first).click
          end
          find('.multiple-item-0', match: :first).click
          select('Data Center Contact Person', from: 'draft_data_contacts_0_data_contact_type')
        end

        it 'deletes child multiple-items' do
          within '.related-urls' do
            expect(page).to have_no_css('.multiple-item-1')
          end
        end

        # Based on the selected country, this text box changes.
        # This test is to show that the change events for deselecting
        # it are working properly.
        it 'resets variable input boxes' do
          within '.addresses' do
            expect(page).to have_css('.state-province-text-field')
            expect(page).to have_no_css('.state-province-select')
          end
        end

        it 'does not have an error message' do
          expect(page).to have_no_content('This draft has the following errors')
        end
      end

      context 'when deleting the last contact that is not contact 1' do
        before do
          click_on 'Add another Data Contact'

          within '.data-contacts > .multiple-item-0 > .eui-accordion__header > .actions' do
            find('a.remove', match: :first).click()
          end

          within '.data-contacts > .multiple-item-1 > .eui-accordion__header > .actions' do
            find('a.remove', match: :first).click()
          end
        end

        it 'has the right number' do
          expect(page).to have_content('Data Contact 1')
        end
      end
    end
  end
end
