describe 'Collection information preview',js:true do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        #find('.tab-label', text: 'Additional Information').click
      end

      it 'does not display metadata' do
          within 'ul.collection-information-preview' do
            expect(page).to have_no_content('Purpose')
            expect(page).to have_no_content('Version Description')
        end
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        #find('.tab-label', text: 'Additional Information').click
      end

      it 'displays the metadata' do
        within '#metadata-preview' do
          #within 'ul.collection-information-preview' do
          #within 'li.purpose' do
            expect(page).to have_content('This is the purpose field')
          end

          within '#metadata-preview' do
            #within 'li.version-description' do
            expect(page).to have_content('Version 1 Description')
          end
        end
      end
    end
  end

