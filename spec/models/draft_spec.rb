require 'rails_helper'

describe Draft do
  # title method
  it 'returns a drafts title if available' do
    draft = build(:draft, entry_title: 'Title Example')
    expect(draft.title).to eq('Title Example')
  end
  it 'returns <Untitled Collection Record> if there is no entry title' do
    draft = build(:draft, entry_title: nil)
    expect(draft.title).to eq('<Untitled Collection Record>')
  end

  # display_entry_id method
  it 'returns a drafts entry_id if available' do
    draft = build(:draft, entry_id: 'ID Example')
    expect(draft.display_entry_id).to eq('ID Example')
  end
  it 'returns <Blank Entry Id> if there is no entry id' do
    draft = build(:draft)
    expect(draft.display_entry_id).to eq('<Blank Entry Id>')
  end
end
