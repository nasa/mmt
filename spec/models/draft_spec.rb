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

  # display_entry_id method
  it '"display_entry_id" returns a drafts entry_id if available' do
    draft = build(:draft, entry_id: 'ID Example')
    expect(draft.display_entry_id).to eq('ID Example')
  end
  it '"display_entry_id" returns <Blank Entry Id> if there is no entry id' do
    draft = build(:draft)
    expect(draft.display_entry_id).to eq('<Blank Entry Id>')
  end

  # update_draft method
  it '"update_draft" saves entry_id on update' do
    draft = create(:draft)
    params = {'entry_id' => {'id' => '12345'}, 'entry_title' => 'new title'}

    draft.update_draft(params)

    expect(draft.display_entry_id).to eq('12345')
  end
  it '"update_draft" saves entry_title on update' do
    draft = create(:draft)
    params = {'entry_id' => {'id' => '12345'}, 'entry_title' => 'new title'}

    draft.update_draft(params)

    expect(draft.display_entry_title).to eq('new title')
  end
  it '"update_draft" overwrites old values with new values' do
    draft = create(:draft, draft: {'EntryTitle' => 'test title'})
    params = {'entry_title' => 'new title'}

    draft.update_draft(params)

    expect(draft.draft).to eq({'EntryTitle' => 'new title'})
  end
  it '"update_draft" deletes empty values' do
    draft = create(:draft, draft: {'EntryTitle' => 'test title'})
    params = {'entry_id' => {'id' => '12345'}, 'entry_title' => ''}

    draft.update_draft(params)

    expect(draft.draft).to eq({"EntryId" => {"Id" => "12345"}})
  end
  it '"update_draft" converts number fields to numbers' do
    draft = create(:draft, draft: {})
    params = {'size' => '42'}

    draft.update_draft(params)

    expect(draft.draft).to eq({'Size' => 42.0})
  end
  it '"update_draft" converts integer fields to integers' do
    draft = create(:draft, draft: {})
    params = {'number_of_sensors' => '42'}

    draft.update_draft(params)

    expect(draft.draft).to eq({'NumberOfSensors' => 42})
  end
  it '"update_draft" converts boolean fields to boolean' do
    draft = create(:draft, draft: {})
    params = {'ends_at_present_flag' => 'false'}

    draft.update_draft(params)

    expect(draft.draft).to eq({'EndsAtPresentFlag' => false})
  end
end
