describe 'Collection drafts with NEAR_REAL_TIME' do
  before do
    login
  end

  context 'When viewing a collection draft with NEAR_REAL_TIME' do
    before do
      @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
      @draft.draft['CollectionDataType'] = 'NEAR_REAL_TIME'
      @draft.save
      visit collection_draft_path(@draft)
    end

    it 'displays the NRT badge' do
      within '#collection-general-overview .collection-title .title-nrt-badge' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'NRT')
      end
    end
  end
end
