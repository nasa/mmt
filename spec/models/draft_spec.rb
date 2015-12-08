require 'rails_helper'

describe Draft do
  # display_entry_title method
  it '"display_entry_title" returns a drafts title if available' do
    draft = build(:draft, entry_title: 'Title Example')
    expect(draft.display_entry_title).to eq('Title Example')
  end
  it '"display_entry_title" returns <Untitled Collection Record> if there is no entry title' do
    draft = build(:draft, entry_title: nil)
    expect(draft.display_entry_title).to eq('<Untitled Collection Record>')
  end

  # display_short_name method
  it '"display_short_name" returns a drafts short_name if available' do
    draft = build(:draft, short_name: 'ID Example')
    expect(draft.display_short_name).to eq('ID Example')
  end
  it '"display_short_name" returns <Blank Short Name> if there is no entry id' do
    draft = build(:draft)
    expect(draft.display_short_name).to eq('<Blank Short Name>')
  end

  # update_draft method
  it '"update_draft" saves short_name on update' do
    draft = create(:draft)
    params = { 'short_name' => '12345', 'entry_title' => 'new title' }

    draft.update_draft(params)

    expect(draft.display_short_name).to eq('12345')
  end
  it '"update_draft" saves entry_title on update' do
    draft = create(:draft)
    params = { 'short_name' => '12345', 'entry_title' => 'new title' }

    draft.update_draft(params)

    expect(draft.display_entry_title).to eq('new title')
  end
  it '"update_draft" overwrites old values with new values' do
    draft = create(:draft, draft: { 'EntryTitle' => 'test title' })
    params = { 'entry_title' => 'new title' }

    draft.update_draft(params)

    expect(draft.draft).to eq('EntryTitle' => 'new title')
  end
  it '"update_draft" deletes empty values' do
    draft = create(:draft, draft: { 'EntryTitle' => 'test title' })
    params = { 'short_name' => '12345', 'entry_title' => '' }

    draft.update_draft(params)

    expect(draft.draft).to eq('ShortName' => '12345')
  end
  it '"update_draft" converts number fields to numbers' do
    draft = create(:draft, draft: {})
    params = { 'size' => '42' }

    draft.update_draft(params)

    expect(draft.draft).to eq('Size' => 42.0)
  end
  it '"update_draft" converts number filds with delimiters to numbers' do
    draft = create(:draft, draft: {})
    params = { 'size' => '9,001' }

    draft.update_draft(params)

    expect(draft.draft).to eq('Size' => 9001.0)
  end
  it '"update_draft" converts integer fields to integers' do
    draft = create(:draft, draft: {})
    params = { 'number_of_sensors' => '42' }

    draft.update_draft(params)

    expect(draft.draft).to eq('NumberOfSensors' => 42)
  end
  it '"update_draft" converts boolean fields to boolean' do
    draft = create(:draft, draft: {})
    params = { 'ends_at_present_flag' => 'false' }

    draft.update_draft(params)

    expect(draft.draft).to eq('EndsAtPresentFlag' => false)
  end

  # after_create sets native_id
  it 'saves a native_id after create' do
    draft = create(:draft)
    expect(draft.native_id).to include('mmt_collection_')
  end

  # create_from_collection method
  it '"create_from_collection" saves a native_id' do
    collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
    user = User.create(urs_uid: 'testuser')
    native_id = 'test_id'
    draft = Draft.create_from_collection(collection, user, native_id)

    expect(draft.native_id).to eq(native_id)
  end
  it '"create_from_collection" saves a user' do
    collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
    user = User.create(urs_uid: 'testuser')
    native_id = 'test_id'
    draft = Draft.create_from_collection(collection, user, native_id)

    expect(draft.user).to eq(user)
  end
  it '"create_from_collection" saves the draft' do
    collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
    user = User.create(urs_uid: 'testuser')
    native_id = 'test_id'
    draft = Draft.create_from_collection(collection, user, native_id)

    expect(draft.draft).to eq(collection)
  end
end
