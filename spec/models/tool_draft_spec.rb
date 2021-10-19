describe ToolDraft do
  # display_entry_title method
  it '`display_entry_title` returns a draft title if available' do
    tool_draft = build(:full_tool_draft, entry_title: 'Title Example')
    expect(tool_draft.display_entry_title).to eq('Title Example')
  end

  it '`display_entry_title` returns <Untitled Tool Record> if there is no entry title' do
    tool_draft = build(:empty_tool_draft)
    expect(tool_draft.display_entry_title).to eq('<Untitled Tool Record>')
  end

  # display_short_name method
  it "`display_short_name` returns a draft's short_name if available" do
    tool_draft = build(:full_tool_draft, short_name: 'Tool Test Name')
    expect(tool_draft.display_short_name).to eq('Tool Test Name')
  end

  it "`display_short_name` returns <Blank Name> if there is no entry id" do
    tool_draft = build(:empty_tool_draft)
    expect(tool_draft.display_short_name).to eq('<Blank Name>')
  end

  # set_searchable_fields method invoked before_save
  it 'does not set short name and entry title if the tool draft has not been saved' do
    tool_draft = build(:full_tool_draft)
    expect(tool_draft.entry_title).to be(nil)
    expect(tool_draft.short_name).to be(nil)
  end

  it 'sets short name and entry title when the tool draft has been saved' do
    tool_draft = create(:full_tool_draft, draft_entry_title: 'Test Tool Long Name', draft_short_name: 'Test Tool Name')
    expect(tool_draft.entry_title).to eq('Test Tool Long Name')
    expect(tool_draft.short_name).to eq('Test Tool Name')
  end

  # after_create sets native_id (inherited method)
  it 'saves a native_id after create' do
    tool_draft = create(:empty_tool_draft)
    expect(tool_draft.native_id).to include('mmt_tool_')
  end

  # set_metadata_specification invoked before_save
  it 'sets the MetadataSpecification after the tool draft has been saved' do
    tool_draft = create(:empty_tool_draft)
    metadata_specification = tool_draft.draft['MetadataSpecification']
    expect(metadata_specification['URL']).to eq('https://cdn.earthdata.nasa.gov/umm/tool/v1.1')
    expect(metadata_specification['Name']).to eq('UMM-T')
    expect(metadata_specification['Version']).to eq('1.1')
  end

  it 'does not set the MetadataSpecification if the tool has not been saved' do
    tool_draft = build(:empty_tool_draft)
    expect(tool_draft.draft['MetadataSpecification']).to be(nil)
  end

  # create_from_tool method
  it '`create_from_tool` saves the provided native_id' do
    tool = { 'Name' => 'Test Tool Name', 'LongName' => 'test tool long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    tool_draft = ToolDraft.create_from_tool(tool, user, native_id, nil)

    expect(tool_draft.native_id).to eq(native_id)
  end

  it '`create_from_tool` saves a user' do
    tool = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    tool_draft = ToolDraft.create_from_tool(tool, user, native_id, nil)

    expect(tool_draft.user).to eq(user)
  end

  it '`create_from_tool` saves the draft' do
    tool = { 'Name' => 'Test Name', 'LongName' => 'test long name', 'MetadataSpecification' => { 'Name' => 'UMM-T', 'URL' => 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1', 'Version' => '1.1' } }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    tool_draft = ToolDraft.create_from_tool(tool, user, native_id, nil)

    expect(tool_draft.draft).to eq(tool)
  end

  it '`create_from_tool` saves a native_id with the "set_native_id" format if one is not provided' do
    tool = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    tool_draft = ToolDraft.create_from_tool(tool, user, nil, nil)

    expect(tool_draft.native_id).to include('mmt_tool_')
  end

  it '`create_from_tool` removes the draft Name and LongName values if a native_id is not provided' do
    tool = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    tool_draft = ToolDraft.create_from_tool(tool, user, nil, nil)

    expect(tool_draft.draft['Name']).to be_nil
    expect(tool_draft.draft['LongName']).to be_nil
  end

  it '`create_from_tool` does not save a short_name or entry_title if a native_id is not provided' do
    tool = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    tool_draft = ToolDraft.create_from_tool(tool, user, nil, nil)

    expect(tool_draft.short_name).to be_nil
    expect(tool_draft.entry_title).to be_nil
  end

  it '`create_from_tool` does not save a collection_concept_id if a native_id is provided' do
    tool = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    tool_draft = ToolDraft.create_from_tool(tool, user, native_id, 'C12345-MMT_2')

    expect(tool_draft.collection_concept_id).to be_nil
  end

  it '`create_from_tool` does not save a collection_concept_id if a native_id is not provided' do
    tool = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    tool_draft = ToolDraft.create_from_tool(tool, user, native_id, 'C12345-MMT_2')

    expect(tool_draft.collection_concept_id).to be_nil
  end

  it 'is not valid without a provider_id' do
    tool_draft = build(:full_tool_draft, provider_id: nil)

    expect(tool_draft.valid?).to eq(false)
  end

  it 'is not valid with a collection_concept_id' do
    tool_draft = build(:full_tool_draft, collection_concept_id: 'C12345-MMT_2')

    expect(tool_draft.valid?).to eq(false)
  end

  it 'does not save a collection concept id' do
    tool_draft = create(:full_tool_draft)
    expect(tool_draft.update(collection_concept_id: 'C12345-MMT_2')).to eq(false)
  end
end
