# NOTE: Most tests are being commented out because of preview gem overhaul
# We should keep the tests to ensure everything is being tested, but old
# tests should be removed when final changes are made.

describe 'Metadata information preview' do
  context 'when viewing the preview page', js: true do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('Metadata Preview')
        expect(page).to have_content('<Blank Short Name>')
        expect(page).to have_content('Entry Title Not Provided')
      end
    end

    context 'when there is metadata', js: true do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        draft.draft['MetadataLanguage'] = 'spa'
        draft.save

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        save_screenshot
        within '.collection-general-overview' do
          expect(page).to have_content('Metadata Preview')
          expect(page).to have_content('This is a long description of the collection')
        end
      end
    end
  end
end
