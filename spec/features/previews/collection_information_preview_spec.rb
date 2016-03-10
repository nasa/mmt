require 'rails_helper'

describe 'Collection information preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        visit draft_path(draft)
      end

      it 'does not display metadata' do
        within 'ul.collection-information-preview' do
          expect(page).to have_no_content('Abstract')
          expect(page).to have_no_content('Purpose')
        end
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)

        visit draft_path(draft)
      end

      it 'displays the metadata' do
        within 'ul.collection-information-preview' do
          within 'li.abstract' do
            expect(page).to have_content('This is a long description of the collection')
          end

          within 'li.purpose' do
            expect(page).to have_content('This is the purpose field')
          end
        end
      end
    end
  end
end
