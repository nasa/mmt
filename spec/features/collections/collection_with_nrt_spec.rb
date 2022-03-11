describe 'Collections with Near Real Time Values' do
  before(:all) do
    @nrt_ingest_response, _concept_response = publish_collection_draft(collection_data_type: 'NEAR_REAL_TIME')
    @ll_ingest_response, _concept_response = publish_collection_draft(collection_data_type: 'LOW_LATENCY')
    @expedited_ingest_response, _concept_response = publish_collection_draft(collection_data_type: 'EXPEDITED')
  end

  context 'When viewing a collection with `NEAR_REAL_TIME`' do
    before do
      login
      visit collection_path(@nrt_ingest_response['concept-id'])
    end

    it 'displays the NRT badge' do
      within '#collection-general-overview .collection-title .title-nrt-badge' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'NRT')
      end
    end

    context 'when visiting the Revisions page' do
      before do
        click_on 'Revisions (1)'
      end

      it 'displays the NRT badge' do
        within '.collection-basics' do
          expect(page).to have_css('span.eui-badge.nrt', text: 'NRT')
        end
      end
    end
  end

  context 'When viewing a collection with `LOW_LATENCY`' do
    before do
      login
      visit collection_path(@ll_ingest_response['concept-id'])
    end

    it 'displays the LOW LATENCY badge' do
      within '#collection-general-overview .collection-title .title-nrt-badge' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'LOW LATENCY')
      end
    end

    context 'when visiting the Revisions page' do
      before do
        click_on 'Revisions (1)'
      end

      it 'displays the LOW LATENCY badge' do
        within '.collection-basics' do
          expect(page).to have_css('span.eui-badge.nrt', text: 'LOW LATENCY')
        end
      end
    end
  end

  context 'When viewing a collection with `EXPEDITED`' do
    before do
      login
      visit collection_path(@expedited_ingest_response['concept-id'])
    end

    it 'displays the EXPEDITED badge' do
      within '#collection-general-overview .collection-title .title-nrt-badge' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'EXPEDITED')
      end
    end

    context 'when visiting the Revisions page' do
      before do
        click_on 'Revisions (1)'
      end

      it 'displays the EXPEDITED badge' do
        within '.collection-basics' do
          expect(page).to have_css('span.eui-badge.nrt', text: 'EXPEDITED')
        end
      end
    end
  end
end
