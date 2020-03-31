describe VariableDraft do
  # display_entry_title method
  it '"display_entry_title" returns a draft title if available' do
    variable_draft = build(:full_variable_draft, entry_title: 'Title Example')
    expect(variable_draft.display_entry_title).to eq('Title Example')
  end

  it '"display_entry_title" returns <Untitled Variable Record> if there is no entry title' do
    variable_draft = build(:empty_variable_draft)
    expect(variable_draft.display_entry_title).to eq('<Untitled Variable Record>')
  end

  # set_searchable_fields method invoked before_save
  it 'does not set short name and entry title if the variable draft has not been saved' do
    variable_draft = build(:full_variable_draft)
    expect(variable_draft.entry_title).to be(nil)
    expect(variable_draft.short_name).to be(nil)
  end

  it 'sets short name and entry title when the variable draft has been saved' do
    variable_draft = create(:full_variable_draft, draft_entry_title: 'Volume mixing ratio of sum of peroxynitrates in air', draft_short_name: 'PNs_LIF')
    expect(variable_draft.entry_title).to eq('Volume mixing ratio of sum of peroxynitrates in air')
    expect(variable_draft.short_name).to eq('PNs_LIF')
  end

  # after_create sets native_id (inherited method)
  it 'saves a native_id after create' do
    variable_draft = create(:empty_variable_draft)
    expect(variable_draft.native_id).to include('mmt_variable_')
  end

  # create_from_variable method
  it '"create_from_variable" saves the provided native_id' do
    variable = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    variable_draft = VariableDraft.create_from_variable(variable, user, native_id)

    expect(variable_draft.native_id).to eq(native_id)
  end

  it '"create_from_variable" saves a user' do
    variable = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    variable_draft = VariableDraft.create_from_variable(variable, user, native_id)

    expect(variable_draft.user).to eq(user)
  end

  it '"create_from_variable" saves the draft' do
    variable = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    native_id = 'test_native_id'
    variable_draft = VariableDraft.create_from_variable(variable, user, native_id)

    expect(variable_draft.draft).to eq(variable)
  end

  it '"create_from_variable" saves a native_id with the "set_native_id" format if one is not provided' do
    variable = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    variable_draft = VariableDraft.create_from_variable(variable, user, nil)

    expect(variable_draft.native_id).to include('mmt_variable_')
  end

  it '"create_from_variable" removes the draft Name and LongName values if a native_id is not provided' do
    variable = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    variable_draft = VariableDraft.create_from_variable(variable, user, nil)

    expect(variable_draft.draft['Name']).to be_nil
    expect(variable_draft.draft['LongName']).to be_nil
  end

  it '"create_from_variable" does not save a short_name or entry_title if a native_id is not provided' do
    variable = { 'Name' => 'Test Name', 'LongName' => 'test long name' }
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    variable_draft = VariableDraft.create_from_variable(variable, user, nil)

    expect(variable_draft.short_name).to be_nil
    expect(variable_draft.entry_title).to be_nil
  end

  it 'is not valid without a provider_id' do
    variable_draft = build(:full_variable_draft, provider_id: nil)

    expect(variable_draft.valid?).to eq(false)
  end
end
