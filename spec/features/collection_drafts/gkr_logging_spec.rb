describe 'GCMD Keyword Recommender (GKR) Tests', js: true do
  before do
    login
    @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    @draft2 = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
  end

  context 'when saving GKR recommendations' do
    before do
      allow_any_instance_of(GkrKeywordRecommendations).to receive(:fetch_keyword_recommendations).and_return({ id: 22,
                                                                                                               recommendations: ['EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC CHEMISTRY > OXYGEN COMPOUNDS > OZONE', 'EARTH SCIENCE > ATMOSPHERE > AIR QUALITY'],
                                                                                                               uuids: { 'EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC CHEMISTRY > OXYGEN COMPOUNDS > OZONE': 1, 'EARTH SCIENCE > ATMOSPHERE > AIR QUALITY': 2 } })
      visit edit_collection_draft_path(@draft, form: 'descriptive_keywords')
    end

    it 'logs the Save operation' do
      click_on 'Expand All'
      within '.nav-top' do
        VCR.use_cassette('gkr/send_feedback', record: :none) do
          allow(Rails.logger).to receive(:info)
          expect(Rails.logger).to receive(:info).with(/GkrLog: type: SAVE/)
          click_on 'Save'
        end
      end
    end
  end

  context 'when publishing GKR recommendations' do
    before do
      allow_any_instance_of(GkrKeywordRecommendations).to receive(:fetch_keyword_recommendations).and_return({ id: 22,
                                                                                                               recommendations: ['EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC CHEMISTRY > OXYGEN COMPOUNDS > OZONE', 'EARTH SCIENCE > ATMOSPHERE > AIR QUALITY'],
                                                                                                               uuids: { 'EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC CHEMISTRY > OXYGEN COMPOUNDS > OZONE': 1, 'EARTH SCIENCE > ATMOSPHERE > AIR QUALITY': 2 } })
      visit edit_collection_draft_path(@draft, form: 'descriptive_keywords')
    end

    it 'logs the Publish operation' do
      click_on 'Expand All'
      within '.nav-top' do
        VCR.use_cassette('gkr/send_feedback', record: :none) do
          click_on 'Done'
        end
      end
      allow(Rails.logger).to receive(:info)
      expect(Rails.logger).to receive(:info).with(start_with('GkrLog: type: PUBLISH'))
      click_on 'Publish'
    end
  end

  context 'when there is a failure fetching GKR recommendations' do
    before do
      allow_any_instance_of(GkrKeywordRecommendations).to receive(:fetch_keyword_recommendations).and_return({ error: 'CommError' })
      visit edit_collection_draft_path(@draft2, form: 'descriptive_keywords')
    end

    it 'notifies the user that we couldnt retrieve recommendations' do
      expect(page).to have_content('We are unable to retrieve keyword recommendations for request')
    end
  end
end
