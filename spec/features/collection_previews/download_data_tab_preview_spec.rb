describe 'Download Data Tab preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        find('.tab-label', text: 'Download Data').click
      end

      it 'does not display metadata' do
        expect(page).to have_content('A direct link to download data is not available for this collection.')
      end

    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        find('.tab-label', text: 'Download Data').click
      end

      it 'display metadata' do
        within '#download-data-panel' do
          expect(page).to have_content('Download Options')
          expect(page).to have_content('Earthdata Search: https://search.earthdata.nasa.gov/, Related URL 2 Description')
          expect(page).to have_link('https://search.earthdata.nasa.gov/')
          expect(page).to have_content('OPENDAP DATA: https://example.com/, Related URL 3 Description')
          expect(page).to have_link('https://example.com/')
        end
      end
    end

    context 'when there is metadata but Subtype was not supplied' do
      before do
        login
        draft = create(:collection_draft_no_related_url_subtype, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        find('.tab-label', text: 'Download Data').click
      end

      it 'display metadata' do
        within '#download-data-panel' do
          expect(page).to have_content('Download Options')
          expect(page).to have_content('GET DATA: https://search.earthdata.nasa.gov/, Related URL 2 Description')
          expect(page).to have_link('https://search.earthdata.nasa.gov/')
        end
      end
    end
  end
end
