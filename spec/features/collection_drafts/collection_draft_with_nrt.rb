describe 'Collection drafts with Near Real Time Values' do
  let(:collection_draft) { create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
  end

  context 'When viewing a collection draft with `NEAR_REAL_TIME`' do
    before do
      collection_draft.draft['CollectionDataType'] = 'NEAR_REAL_TIME'
      collection_draft.save
      visit collection_draft_path(collection_draft)
    end

    it 'displays the NRT badge' do
      within '#collection-general-overview .collection-title .title-nrt-badge' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'NRT')
      end
    end
  end

  context 'when viewing a collection draft with `LOW_LATENCY`' do
    before do
      collection_draft.draft['CollectionDataType'] = 'LOW_LATENCY'
      collection_draft.save
      visit collection_draft_path(collection_draft)
    end

    it 'displays the LOW LATENCY badge' do
      within '#collection-general-overview .collection-title .title-nrt-badge' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'LOW LATENCY')
      end
    end
  end

  context 'when viewing a collection draft with `EXPEDITED`' do
    before do
      collection_draft.draft['CollectionDataType'] = 'EXPEDITED'
      collection_draft.save
      visit collection_draft_path(collection_draft)
    end

    it 'displays the EXPEDITED badge' do
      within '#collection-general-overview .collection-title .title-nrt-badge' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'EXPEDITED')
      end
    end
  end
end
