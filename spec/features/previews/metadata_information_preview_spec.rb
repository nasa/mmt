require 'rails_helper'

describe 'Metadata information preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('There are no additional metadata details for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        draft.draft['MetadataLanguage'] = 'spa'
        draft.save

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        within '.metadata-information-preview' do
          expect(page).to have_content('Metadata Dates')
          within '.metadata-dates-table' do
            expect(page).to have_content('Creation 2010-12-25T00:00:00Z', normalize_ws: true)
            expect(page).to have_content('Last Revision 2010-12-30T00:00:00Z', normalize_ws: true)
          end

          within '.directory-names-table' do
            expect(page).to have_content('Short Directory 1 Long Directory 1', normalize_ws: true)
            expect(page).to have_content('Short Directory 2 Long Directory 2', normalize_ws: true)
          end

          expect(page).to have_content('Language')
          expect(page).to have_content('spa')
        end
      end
    end
  end
end
