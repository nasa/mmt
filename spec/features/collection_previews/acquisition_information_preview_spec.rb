describe 'Acquisition information preview',js:true do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        #screenshot_and_open_image
        #save_and_open_page
        within '#metadata-preview' do
          expect(page).to have_no_content('Projects')
        end
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        #screenshot_and_open_image
        within '#metadata-preview' do
          #within all('tr')[1] do
          expect(page).to have_content('AA')
          expect(page).to have_content('test 1a Campaign')
          expect(page).to have_content('test 1b Campaign')
          expect(page).to have_content('2015-07-01')
          expect(page).to have_content('2015-12-25')
          #end
        #within all('tr')[2] do
          expect(page).to have_content('EUDASM')
          expect(page).to have_content('test 2a Campaign')
          expect(page).to have_content('test 2b Campaign')
          expect(page).to have_content('2015-07-01')
          expect(page).to have_content('2015-12-25')
          #end
        end
      end
    end
  end
end
