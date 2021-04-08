describe 'Auto populating metadata dates', js: true do
  context 'when publishing a new collection' do
    before do
      login
      draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

      # Remove Metadata Dates
      metadata = draft.draft
      metadata.delete('MetadataDates')
      draft.draft = metadata
      draft.save

      visit collection_draft_path(draft)

      click_on 'Publish'
      wait_for_cmr

      find('.tab-label', text: 'Additional Information').click
    end

    it 'displays the create date on the collection page' do
      within '.metadata-dates-table' do
        expect(page).to have_content("Creation #{today_string}")
      end
    end

    context 'when publishing an update to the collection' do
      before do
        click_on 'Edit Collection Record'
        within '.metadata' do
          click_on 'Metadata Information'
        end
        open_accordions

        add_metadata_dates

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Publish'
        wait_for_cmr

        find('.tab-label', text: 'Additional Information').click
      end

      it 'displays the update date, new metadata dates, and creation date on the collection page' do
        within '.metadata-dates-table' do
          expect(page).to have_content('Future Review 2015-07-01T00:00:00Z')
          expect(page).to have_content('Planned Deletion 2015-07-02T00:00:00Z')
          expect(page).to have_content("Creation #{today_string}")
          expect(page).to have_content("Last Revision #{today_string}")
        end
      end
    end
  end
end
