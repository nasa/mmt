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
end
