describe 'GCMD Keyword Recommender (GKR) Tests', js: true do
  before do
    login
    @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
  end

  context 'saving GKR recommentations' do
    before do
      allow_any_instance_of(GKRKeywordRecommendations).to receive(:fetch_keyword_recommendations).and_return({id: 22,recommendations: ["EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC CHEMISTRY > OXYGEN COMPOUNDS > OZONE", "EARTH SCIENCE > ATMOSPHERE > AIR QUALITY"]})
      visit edit_collection_draft_path(@draft, form: 'descriptive_keywords')
      click_on 'Expand All'
    end

    it 'logs the Save operation' do
      allow(Rails.logger).to receive(:info)
      expect(Rails.logger).to receive(:info).with(start_with('GkrLog: type: SAVE'))
      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'logs the Publish operation' do
      within '.nav-top' do
        click_on 'Done'
      end
      allow(Rails.logger).to receive(:info)
      expect(Rails.logger).to receive(:info).with(start_with('GkrLog: type: PUBLISH'))
      click_on 'Publish'
    end
  end

  context 'with reconciled keywords' do
    before do
      allow_any_instance_of(GKRKeywordRecommendations).to receive(:fetch_keyword_recommendations).and_return({id: 22,recommendations: ["EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC CHEMISTRY > OXYGEN COMPOUNDS > OZONE", "EARTH SCIENCE > ATMOSPHERE > AIR QUALITY",
                                                                                                                                       "EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE"]})
      visit edit_collection_draft_path(@draft, form: 'descriptive_keywords')
      click_on 'Expand All'
    end

    it 'logs both keywords' do
      allow(Rails.logger).to receive(:info)
      expect(Rails.logger).to receive(:info).with(include('predictions: EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC CHEMISTRY > OXYGEN COMPOUNDS > OZONE,EARTH SCIENCE > ATMOSPHERE > AIR QUALITY'))
      within '.nav-top' do
        click_on 'Save'
      end
    end
  end
end
