require 'rails_helper'

describe Draft do
  # title method
  it 'returns a drafts title if available' do
    draft = build(:draft, entry_title: 'Title Example')
    expect(draft.title).to eq('Title Example')
  end
  it 'returns Untitled if there is no entry title' do
    draft = build(:draft, entry_title: nil)
    expect(draft.title).to eq('<Untitled Collection Record>')
  end

end
