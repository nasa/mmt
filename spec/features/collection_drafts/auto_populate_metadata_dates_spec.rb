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
    end

    it 'displays the create date on the collection page' do
      within '#metadata-preview' do
        expect(page).to have_content('"MetadataDates"=>[{"Type"=>"CREATE", "Date"=>"')
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
      end

      it 'displays the update date, new metadata dates, and creation date on the collection page' do
        within '#metadata-preview' do
          expect(page).to have_content('MetadataDates')
          expect(page).to have_content('"Type"=>"REVIEW"')
          expect(page).to have_content('"Type"=>"DELETE"')
          expect(page).to have_content('"Type"=>"CREATE"')
          expect(page).to have_content('"Type"=>"UPDATE"')
        end
      end
    end
  end
end
