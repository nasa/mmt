require 'rails_helper'

describe CollectionTemplate do
  # display_title method
  it '"display_title" returns a templates title if available' do
    collection_template = build(:full_collection_template, title: 'Example name')
    expect(collection_template.display_title).to eq('Example name')
  end
  it '"display_title" returns <Untitled Template> if there is no entry title' do
    collection_template = build(:full_collection_template, title: '<Untitled Template>')
    expect(collection_template.display_title).to eq('<Untitled Template>')
  end

  # create_template method
  it '"create_template" saves the name' do
    draft = { 'TestField1' => 'test value1', 'TestField2' => 'test value2' }
    collection_draft = CollectionDraft.create(draft: draft, entry_title: 'Example Entry Title')
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    name = 'Test Template'
    template = CollectionTemplate.create_template(collection_draft, user, name)

    expect(template.title).to eq(name)
  end
  it '"create_template" saves the user' do
    draft = { 'TestField1' => 'test value1', 'TestField2' => 'test value2' }
    collection_draft = CollectionDraft.create(draft: draft, entry_title: 'Example Entry Title')
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    name = 'Test Template'
    template = CollectionTemplate.create_template(collection_draft, user, name)

    expect(template.user).to eq(user)
  end
  it '"create_template" saves the entry title' do
    draft = { 'TestField1' => 'test value1', 'TestField2' => 'test value2' }
    collection_draft = CollectionDraft.create(draft: draft, entry_title: 'Example Entry Title')
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    name = 'Test Template'
    template = CollectionTemplate.create_template(collection_draft, user, name)

    expect(template.entry_title).to eq('Example Entry Title')
  end
  it '"create_template" saves the draft' do
    draft = { 'TestField1' => 'test value1', 'TestField2' => 'test value2' }
    collection_draft = CollectionDraft.create(draft: draft, entry_title: 'Example Entry Title')
    user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
    name = 'Test Template'
    template = CollectionTemplate.create_template(collection_draft, user, name)

    expect(template.draft).to eq(draft)
  end
end
