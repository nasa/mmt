describe 'General Overview preview',js:true do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

      end
    end

    context 'when there is metadata' do
      let(:short_name)  { 'Test Draft Short Name' }
      let(:entry_title) { 'Test Draft Entry Title' }

      before do
        login
        draft = create(:full_collection_draft, draft_entry_title: entry_title, draft_short_name: short_name, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        #screenshot_and_open_image
        within '#metadata-preview' do
          #screenshot_and_open_image
          expect(page).to have_content(short_name)
          expect(page).to have_content(entry_title)
          expect(page).to have_content('This is a long description of the collection')
        end
      end
    end
  end
end
