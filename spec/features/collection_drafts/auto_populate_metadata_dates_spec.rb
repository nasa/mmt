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

    context 'when publishing an update to the collection' do
      it 'displays the update date, new metadata dates, and creation date on the collection page' do
        within '#metadata-preview' do
          expect(page).to have_content('"Type":"CREATE"')
          expect(page).to have_content('"Type":"UPDATE"')
        end
      end
    end
  end
end
