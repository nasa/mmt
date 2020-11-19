describe CollectionTemplate do
  # display_title method
  it "`display_template_name` returns a template's title if available" do
    collection_template = build(:full_collection_template, collection_template_name: 'Example Template Name')
    expect(collection_template.display_template_name).to eq('Example Template Name')
  end
  it '`display_template_name` returns <Untitled Template> if there is no entry title' do
    # collection_template = build(:full_collection_template, collection_template_name: '<Untitled Template>')
    collection_template = CollectionTemplate.create
    expect(collection_template.display_template_name).to eq('<Untitled Template>')
  end

  it '`display_entry_title` returns a templates title if available' do
    collection_template = build(:full_collection_template, draft_entry_title: 'Example Entry Title')
    expect(collection_template.display_entry_title).to eq('Example Entry Title')
  end
  it '`display_entry_title` returns <Blank Entry Title> if there is no entry title' do
    collection_template = CollectionTemplate.create
    # collection_template = build(:full_collection_template, collection_template_name: '<Untitled Template>')
    expect(collection_template.display_entry_title).to eq('<Blank Entry Title>')
  end

  it '`display_short_name` returns a templates title if available' do
    collection_template = build(:full_collection_template, short_name: 'Example name')
    expect(collection_template.display_short_name).to eq('Example name')
  end
  it '`display_short_name` returns <Blank Short Name> if there is no short name' do
    collection_template = CollectionTemplate.create
    # collection_template = build(:full_collection_template, short_name: '<Untitled Template>')
    expect(collection_template.display_short_name).to eq('<Blank Short Name>')
  end

  # Keyword Recommendations
  # these methods (as with almost all) inherit from CollectionDraft, so should
  # work the same. However, due to the polymorphic association with KeywordRecommendation
  # we should also test anything that touches the association
  context 'when Keyword Recommendations is turned on' do
    before do
      allow(Mmt::Application.config).to receive(:gkr_enabled).and_return(true)
    end

    it '"keyword_recommendation_needed?" returns `false` if a recommendation already exists' do
      collection_template = create(:full_collection_template)
      collection_template.record_recommendation_provided
      expect(collection_template.keyword_recommendation_needed?).to eq(false)
    end

    it '"record_recommendation_provided" returns `nil` if a recommendation already exists' do
      collection_template = create(:full_collection_template)
      collection_template.record_recommendation_provided
      expect(collection_template.record_recommendation_provided).to eq(nil)
    end

    it '"record_recommendation_provided" creates a recommendation if there is an abstract and no recommendation exists for the draft' do
      collection_template = create(:full_collection_template)
      expect(collection_template.keyword_recommendations).to eq([])

      expect(collection_template.record_recommendation_provided).to eq(KeywordRecommendation.first)
      expect(collection_template.keyword_recommendations.count).to eq(1)
    end

    it '"record_recommendation_provided" creates a recommendation in the correct model' do
      collection_template = create(:full_collection_template)
      collection_template.record_recommendation_provided
      expect(collection_template.keyword_recommendations.count).to eq(1)
      expect(KeywordRecommendation.all.count).to eq(1)
      expect(ProposalKeywordRecommendation.all.count).to eq(0)
    end
  end
end
