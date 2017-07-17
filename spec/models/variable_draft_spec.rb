require 'rails_helper'

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
end
