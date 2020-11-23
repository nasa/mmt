describe KeywordRecommendation do
  context 'when Keyword Recommendations is turned on' do
    before do
      allow(Mmt::Application.config).to receive(:gkr_enabled).and_return(true)
    end

    it 'cannot be created without a CollectionDraft or CollectionTemplate' do
      expect { KeywordRecommendation.create! }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it 'can be created by a CollectionDraft or CollectionTemplate' do
      collection_draft = create(:full_collection_draft)
      collection_template = create(:full_collection_template)

      collection_draft.keyword_recommendations.create
      collection_template.keyword_recommendations.create

      KeywordRecommendation.all.count == 2
    end
  end

  context 'when Keyword Recommendations is turned off' do
    before do
      allow(Mmt::Application.config).to receive(:gkr_enabled).and_return(false)
    end

    it 'cannot be created' do
      collection_draft = create(:full_collection_draft)
      collection_template = create(:full_collection_template)

      expect { collection_draft.keyword_recommendations.create! }.to raise_error(ActiveRecord::RecordNotSaved)
      expect { collection_template.keyword_recommendations.create! }.to raise_error(ActiveRecord::RecordNotSaved)

      KeywordRecommendation.all.count == 0
    end
  end
end
