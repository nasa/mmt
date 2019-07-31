require 'rails_helper'

describe CollectionTemplate do
  # display_title method
  it '"display_entry_title" returns a templates title if available' do
    collection_template = build(:full_collection_template, template_name: 'Example name')
    expect(collection_template.display_entry_title).to eq('Example name')
  end
  it '"display_entry_title" returns <Untitled Template> if there is no entry title' do
    collection_template = build(:full_collection_template, template_name: '<Untitled Template>')
    expect(collection_template.display_entry_title).to eq('<Untitled Template>')
  end

  it '"display_short_name" returns a templates title if available' do
    collection_template = build(:full_collection_template, short_name: 'Example name')
    expect(collection_template.display_short_name).to eq('Example name')
  end
  it '"display_short_name" returns <Untitled Template> if there is no entry title' do
    collection_template = build(:full_collection_template, short_name: '<Untitled Template>')
    expect(collection_template.display_short_name).to eq('<Untitled Template>')
  end
end
