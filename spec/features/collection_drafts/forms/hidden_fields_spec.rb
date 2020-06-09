# MMT-1571

describe 'Removed field', js: true do
  before do
    login
    draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)

    within '.col-3' do
      click_on "Save"
    end
  end

  it 'collection draft should still contain DirectoryNames' do
    draft = CollectionDraft.first
    expect(draft.draft.keys).to include('DirectoryNames')
  end
end
