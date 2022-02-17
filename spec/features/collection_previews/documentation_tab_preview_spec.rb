describe 'Documentation Tab preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        #find('.tab-label', text: 'Documentation').click
      end

      it 'does not display metadata' do
        #expect(page).to have_content('Documentation information is not available for this collection.')
      end

    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        #find('.tab-label', text: 'Documentation').click
      end

      it 'display metadata' do
        #within '#documentation-panel' do
        #expect(page).to have_content('GENERAL DOCUMENTATION: https://example.com/documentation-1, This is general documentation')
        #expect(page).to have_link('https://example.com/documentation-1')
        #expect(page).to have_content('HOW-TO: https://example.com/documentation-2, This is how-to document')
        #expect(page).to have_link('https://example.com/documentation-2')
        #expect(page).to have_content('ANOMALIES: https://example.com/documentation-3, This is anomalies documentation')
        #expect(page).to have_link('https://example.com/documentation-3')
        #end
      end

    end

  end
end