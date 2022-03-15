describe ServiceDraft do
  # display_entry_title method
  it '`display_entry_title` returns a draft title if available' do
    service_draft = build(:full_service_draft, entry_title: 'Title Example')
    expect(service_draft.display_entry_title).to eq('Title Example')
  end

  it '`display_entry_title` returns <Untitled Service Record> if there is no entry title' do
    service_draft = build(:empty_service_draft)
    expect(service_draft.display_entry_title).to eq('<Untitled Service Record>')
  end

  # display_short_name method
  it "`display_short_name` returns a draft's short_name if available" do
    service_draft = build(:full_service_draft, short_name: 'Service Test Name')
    expect(service_draft.display_short_name).to eq('Service Test Name')
  end

  it '`display_short_name` returns <Blank Name> if there is no entry id' do
    service_draft = build(:empty_service_draft)
    expect(service_draft.display_short_name).to eq('<Blank Name>')
  end

  # set_searchable_fields method invoked before_save
  it 'does not set short name and entry title if the service draft has not been saved' do
    service_draft = build(:full_service_draft)
    expect(service_draft.entry_title).to be(nil)
    expect(service_draft.short_name).to be(nil)
  end

  it 'sets short name and entry title when the service draft has been saved' do
    service_draft = create(:full_service_draft, draft_entry_title: 'Test Service Long Name', draft_short_name: 'Test Service Name')
    expect(service_draft.entry_title).to eq('Test Service Long Name')
    expect(service_draft.short_name).to eq('Test Service Name')
  end

  # after_create sets native_id (inherited method)
  it 'saves a native_id after create' do
    service_draft = create(:empty_service_draft)
    expect(service_draft.native_id).to include('mmt_service_')
  end

  # set_metadata_specification invoked before_save
  it 'sets the MetadataSpecification after the service draft has been saved' do
    service_draft = create(:empty_service_draft)
    metadata_specification = service_draft.draft['MetadataSpecification']
    expect(metadata_specification['URL']).to eq('https://cdn.earthdata.nasa.gov/umm/service/v1.4')
    expect(metadata_specification['Name']).to eq('UMM-S')
    expect(metadata_specification['Version']).to eq('1.4')
  end

  it 'does not set the MetadataSpecification if the service has not been saved' do
    service_draft = build(:empty_service_draft)
    expect(service_draft.draft['MetadataSpecification']).to be(nil)
  end

  # create_from_service method
  it '`create_from_service` saves the provided native_id' do
    service = { 'Name' => 'Test Service Name', 'LongName' => 'test service long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    service_draft = ServiceDraft.create_from_service(service, user, native_id, nil)

    expect(service_draft.native_id).to eq(native_id)
  end

  it '`create_from_service` saves a user' do
    service = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    service_draft = ServiceDraft.create_from_service(service, user, native_id, nil)

    expect(service_draft.user).to eq(user)
  end

  it '`create_from_service` saves the draft' do
    service = { 'Name' => 'Test Name', 'LongName' => 'test long name', 'MetadataSpecification' => { 'Name' => 'UMM-S', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/service/v1.4', 'Version' => '1.4' } }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    service_draft = ServiceDraft.create_from_service(service, user, native_id, nil)

    expect(service_draft.draft).to eq(service)
  end

  it '`create_from_service` saves a native_id with the "set_native_id" format if one is not provided' do
    service = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    service_draft = ServiceDraft.create_from_service(service, user, nil, nil)

    expect(service_draft.native_id).to include('mmt_service_')
  end

  it '`create_from_service` removes the draft Name and LongName values if a native_id is not provided' do
    service = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    service_draft = ServiceDraft.create_from_service(service, user, nil, nil)

    expect(service_draft.draft['Name']).to be_nil
    expect(service_draft.draft['LongName']).to be_nil
  end

  it '`create_from_service` does not save a short_name or entry_title if a native_id is not provided' do
    service = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    service_draft = ServiceDraft.create_from_service(service, user, nil, nil)

    expect(service_draft.short_name).to be_nil
    expect(service_draft.entry_title).to be_nil
  end

  it '`create_from_service` does not save a collection_concept_id if a native_id is provided' do
    service = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    service_draft = ServiceDraft.create_from_service(service, user, native_id, 'C12345-MMT_2')

    expect(service_draft.collection_concept_id).to be_nil
  end

  it '`create_from_service` does not save a collection_concept_id if a native_id is not provided' do
    service = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    service_draft = ServiceDraft.create_from_service(service, user, native_id, 'C12345-MMT_2')

    expect(service_draft.collection_concept_id).to be_nil
  end

  it 'is not valid without a provider_id' do
    service_draft = build(:full_service_draft, provider_id: nil)

    expect(service_draft.valid?).to eq(false)
  end

  it 'is not valid with a collection_concept_id' do
    service_draft = build(:full_service_draft, collection_concept_id: 'C12345-MMT_2')

    expect(service_draft.valid?).to eq(false)
  end

  it 'does not save a collection concept id' do
    service_draft = create(:full_service_draft)
    expect(service_draft.update(collection_concept_id: 'C12345-MMT_2')).to eq(false)
  end
end
