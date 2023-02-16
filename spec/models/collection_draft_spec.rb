describe CollectionDraft do
  # display_entry_title method
  it "`display_entry_title` returns a draft's title if available" do
    collection_draft = build(:collection_draft, entry_title: 'Title Example')
    expect(collection_draft.display_entry_title).to eq('Title Example')
  end
  it '`display_entry_title` returns <Untitled Collection Record> if there is no entry title' do
    collection_draft = build(:collection_draft, entry_title: nil)
    expect(collection_draft.display_entry_title).to eq('<Untitled Collection Record>')
  end

  # display_short_name method
  it "`display_short_name` returns a draft's short_name if available" do
    collection_draft = build(:collection_draft, short_name: 'ID Example')
    expect(collection_draft.display_short_name).to eq('ID Example')
  end
  it '`display_short_name` returns <Blank Short Name> if there is no entry id' do
    collection_draft = build(:collection_draft)
    expect(collection_draft.display_short_name).to eq('<Blank Short Name>')
  end

  # update_draft method
  it '`update_draft` saves short_name on update' do
    collection_draft = create(:collection_draft)
    user = create(:user)
    params = { 'short_name' => '12345', 'entry_title' => 'new title' }

    collection_draft.update_draft(params, user)

    expect(collection_draft.display_short_name).to eq('12345')
  end
  it '`update_draft` saves entry_title on update' do
    collection_draft = create(:collection_draft)
    user = create(:user)
    params = { 'short_name' => '12345', 'entry_title' => 'new title' }

    collection_draft.update_draft(params, user)

    expect(collection_draft.display_entry_title).to eq('new title')
  end
  it '`update_draft` overwrites old values with new values' do
    collection_draft = create(:collection_draft, draft: { 'EntryTitle' => 'test title' })
    user = create(:user)
    params = { 'entry_title' => 'new title' }

    collection_draft.update_draft(params, user)

    expect(collection_draft.draft).to eq('EntryTitle' => 'new title', 'MetadataSpecification' => { 'Name' => 'UMM-C', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2', 'Version' => '1.17.2' })
  end
  it '`update_draft` deletes empty values' do
    collection_draft = create(:collection_draft, draft: { 'EntryTitle' => 'test title' })
    params = { 'short_name' => '12345', 'entry_title' => '' }
    user = create(:user)

    collection_draft.update_draft(params, user)

    expect(collection_draft.draft).to eq('ShortName' => '12345', 'MetadataSpecification' => { 'Name' => 'UMM-C', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2', 'Version' => '1.17.2' })
  end
  it '`update_draft` converts number fields to numbers' do
    collection_draft = create(:collection_draft, draft: {})
    params = { 'size' => '42' }
    user = create(:user)
    collection_draft.update_draft(params, user)

    expect(collection_draft.draft).to eq('Size' => 42.0, 'MetadataSpecification' => { 'Name' => 'UMM-C', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2', 'Version' => '1.17.2' })
  end
  it '`update_draft` converts number fields with delimiters to numbers' do
    collection_draft = create(:collection_draft, draft: {})
    params = { 'size' => '9,001' }
    user = create(:user)

    collection_draft.update_draft(params, user)

    expect(collection_draft.draft).to eq('Size' => 9001.0, 'MetadataSpecification' => { 'Name' => 'UMM-C', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2', 'Version' => '1.17.2' })
  end
  it '`update_draft` converts integer fields to integers' do
    collection_draft = create(:collection_draft, draft: {})
    params = { 'number_of_instruments' => '42' }
    user = create(:user)

    collection_draft.update_draft(params, user)

    expect(collection_draft.draft).to eq('NumberOfInstruments' => 42, 'MetadataSpecification' => { 'Name' => 'UMM-C', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2', 'Version' => '1.17.2' })
  end
  it '`update_draft` converts boolean fields to boolean' do
    collection_draft = create(:collection_draft, draft: {})
    params = { 'ends_at_present_flag' => 'false' }
    user = create(:user)
    collection_draft.update_draft(params, user)

    expect(collection_draft.draft).to eq('EndsAtPresentFlag' => false, 'MetadataSpecification' => { 'Name' => 'UMM-C', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2', 'Version' => '1.17.2' })
  end

  # after_create sets native_id
  it 'saves a native_id after create' do
    collection_draft = create(:collection_draft)
    expect(collection_draft.native_id).to include('mmt_collection_')
  end
  it 'stores non url encoded native_id' do
    collection_draft = create(:collection_draft, native_id: 'not & url, encoded / native id')
    expect(collection_draft.native_id).to eq('not & url, encoded / native id')
  end

  # set_metadata_specification invoked before_save
  it 'sets the MetadataSpecification after the collection draft has been saved' do
    collection_draft = create(:collection_draft)
    metadata_specification = collection_draft.draft['MetadataSpecification']
    expect(metadata_specification['URL']).to eq('https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2')
    expect(metadata_specification['Name']).to eq('UMM-C')
    expect(metadata_specification['Version']).to eq('1.17.2')
  end

  it 'does not set the MetadataSpecification if the tool has not been saved' do
    collection_draft = build(:collection_draft)
    expect(collection_draft.draft['MetadataSpecification']).to be(nil)
  end

  # create_from_collection method
  it '`create_from_collection` saves a native_id' do
    collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_id'
    collection_draft = CollectionDraft.create_from_collection(collection, user, native_id)

    expect(collection_draft.native_id).to eq(native_id)
  end
  it '`create_from_collection` saves a user' do
    collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_id'
    collection_draft = CollectionDraft.create_from_collection(collection, user, native_id)

    expect(collection_draft.user).to eq(user)
  end
  it '`create_from_collection` saves the draft' do
    collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title', 'MetadataSpecification' => { 'Name' => 'UMM-C', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2', 'Version' => '1.17.2' }}
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_id'
    collection_draft = CollectionDraft.create_from_collection(collection, user, native_id)

    expect(collection_draft.draft).to eq(collection)
  end

  # These tests may be re-enabled or rewritten when create_from_template goes live.
  ## create_from_template method
  #it '"create_from_template" saves the draft' do
  #  draft = { 'TestField1' => 'test value1', 'TestField2' => 'test value2' }
  #  template = CollectionTemplate.create(draft: draft, entry_title: 'test_title')
  #  user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
  #  collection_draft = CollectionDraft.create_from_template(template, user)

  #  expect(collection_draft.draft).to eq(draft)
  #end

  #it '"create_from_template" saves the entry title' do
  #  draft = { 'TestField1' => 'test value1', 'TestField2' => 'test value2' }
  #  template = CollectionTemplate.create(draft: draft, entry_title: 'test_title')
  #  user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
  #  collection_draft = CollectionDraft.create_from_template(template, user)

  #  expect(collection_draft.entry_title).to eq('test_title')
  #end

  #it '"create_from_template" saves the user' do
  #  draft = { 'TestField1' => 'test value1', 'TestField2' => 'test value2' }
  #  template = CollectionTemplate.create(draft: draft, entry_title: 'test_title')
  #  user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
  #  collection_draft = CollectionDraft.create_from_template(template, user)

  #  expect(collection_draft.user).to eq(user)
  #end

  # add_metadata_dates
  it '`add_metadata_dates` adds create and update dates' do
    collection_draft = create(:collection_draft)
    collection_draft.add_metadata_dates

    metadata_dates = collection_draft.draft['MetadataDates']

    expect(metadata_dates.first['Type']).to eq('CREATE')
    expect(metadata_dates.first['Date']).to start_with(today_string)

    expect(metadata_dates.second['Type']).to eq('UPDATE')
    expect(metadata_dates.second['Date']).to start_with(today_string)
  end

  it '`add_metadata_dates` keeps other metadata date values unchanged' do
    collection_draft = create(:collection_draft, draft: { 'MetadataDates' => [
        { 'Type' => 'REVIEW', 'Date' => '2015-07-01T00:00:00Z' },
        { 'Type' => 'DELETE', 'Date' => '2015-07-01T00:00:00Z' }
      ]})
    collection_draft.add_metadata_dates

    metadata_dates = collection_draft.draft['MetadataDates']

    expect(metadata_dates[0]['Type']).to eq('REVIEW')
    expect(metadata_dates[0]['Date']).to eq('2015-07-01T00:00:00Z')

    expect(metadata_dates[1]['Type']).to eq('DELETE')
    expect(metadata_dates[1]['Date']).to eq('2015-07-01T00:00:00Z')

    expect(metadata_dates[2]['Type']).to eq('CREATE')
    expect(metadata_dates[2]['Date']).to start_with(today_string)

    expect(metadata_dates[3]['Type']).to eq('UPDATE')
    expect(metadata_dates[3]['Date']).to start_with(today_string)
  end

  it '`add_metadata_dates` updates UPDATE date but keeps CREATE date' do
    collection_draft = create(:collection_draft, draft: { 'MetadataDates' => [
        { 'Type' => 'CREATE', 'Date' => '2015-07-01T00:00:00Z' },
        { 'Type' => 'UPDATE', 'Date' => '2015-07-01T00:00:00Z' },
        { 'Type' => 'REVIEW', 'Date' => '2015-07-01T00:00:00Z' },
        { 'Type' => 'DELETE', 'Date' => '2015-07-01T00:00:00Z' }
      ]})
    collection_draft.add_metadata_dates

    metadata_dates = collection_draft.draft['MetadataDates']

    expect(metadata_dates[0]['Type']).to eq('REVIEW')
    expect(metadata_dates[0]['Date']).to eq('2015-07-01T00:00:00Z')

    expect(metadata_dates[1]['Type']).to eq('DELETE')
    expect(metadata_dates[1]['Date']).to eq('2015-07-01T00:00:00Z')

    expect(metadata_dates[2]['Type']).to eq('CREATE')
    expect(metadata_dates[2]['Date']).to eq('2015-07-01T00:00:00Z')

    expect(metadata_dates[3]['Type']).to eq('UPDATE')
    expect(metadata_dates[3]['Date']).to start_with(today_string)
  end

  it 'is not valid without a provider_id' do
    collection_draft = build(:collection_draft, provider_id: nil)

    expect(collection_draft.valid?).to eq(false)
  end

  it 'is not valid with a collection_concept_id' do
    collection_draft = build(:collection_draft, collection_concept_id: 'C12345-MMT_2')

    expect(collection_draft.valid?).to eq(false)
  end

  it 'does not save a collection concept id' do
    collection_draft = create(:collection_draft)
    expect(collection_draft.update(collection_concept_id: 'C12345-MMT_2')).to eq(false)
  end

  # Keyword Recommendations
  context 'when Keyword Recommendations is turned off' do
    before do
      allow(Mmt::Application.config).to receive(:gkr_enabled).and_return(false)
    end

    it '"keyword_recommendation_needed?" returns `nil`' do
      collection_draft = create(:full_collection_draft)
      expect(collection_draft.keyword_recommendation_needed?).to eq(nil)
    end

    it '"record_recommendation_provided" returns `nil`' do
      collection_draft = create(:full_collection_draft)
      expect(collection_draft.record_recommendation_provided).to eq(nil)
    end
  end

  context 'when Keyword Recommendations is turned on' do
    before do
      allow(Mmt::Application.config).to receive(:gkr_enabled).and_return(true)
    end

    it '"keyword_recommendation_needed?" returns `false` with no abstract' do
      collection_draft = create(:collection_draft)
      expect(collection_draft.keyword_recommendation_needed?).to eq(false)
    end

    it '"keyword_recommendation_needed?" returns `false` if a recommendation already exists' do
      collection_draft = create(:full_collection_draft)
      collection_draft.record_recommendation_provided
      expect(collection_draft.keyword_recommendation_needed?).to eq(false)
    end

    it '"keyword_recommendation_needed?" returns `true` if there is an abstract and no recommendation exists for the draft' do
      collection_draft = create(:full_collection_draft)
      expect(collection_draft.keyword_recommendations).to eq([])
      expect(collection_draft.keyword_recommendation_needed?).to eq(true)
    end

    it '"record_recommendation_provided" returns `nil` if a recommendation already exists' do
      collection_draft = create(:full_collection_draft)
      collection_draft.record_recommendation_provided
      expect(collection_draft.record_recommendation_provided).to eq(nil)
    end

    it '"record_recommendation_provided" creates a recommendation if there is an abstract and no recommendation exists for the draft' do
      collection_draft = create(:full_collection_draft)
      expect(collection_draft.keyword_recommendations).to eq([])

      expect(collection_draft.record_recommendation_provided).to eq(KeywordRecommendation.first)
      expect(collection_draft.keyword_recommendations.count).to eq(1)
    end

    it '"record_recommendation_provided" creates a recommendation in the correct model' do
      collection_draft = create(:full_collection_draft)
      collection_draft.record_recommendation_provided
      expect(collection_draft.keyword_recommendations.count).to eq(1)
      expect(KeywordRecommendation.all.count).to eq(1)
      expect(ProposalKeywordRecommendation.all.count).to eq(0)
    end

    it 'deleting a collection draft deletes the associated recommendation record' do
      collection_draft = create(:full_collection_draft)
      expect(CollectionDraft.all.count).to eq(1)
      collection_draft.record_recommendation_provided
      expect(collection_draft.keyword_recommendations.count).to eq(1)
      expect(KeywordRecommendation.all.count).to eq(1)

      CollectionDraft.first.destroy
      expect(CollectionDraft.all.count).to eq(0)
      expect(KeywordRecommendation.all.count).to eq(0)
    end
  end
end
