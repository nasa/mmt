# MMT-1571

describe 'Removed field', js: true do
  before do
    login
    draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    @draft1 = CollectionDraft.first
    visit edit_collection_draft_path(draft)

    within '.nav-top' do
      click_on "Save"
    end
  end

  it 'collection draft should contain the same DirectoryNames' do
    draft2 = CollectionDraft.first
    expect(draft2.draft['DirectoryNames']).to eql(@draft1.draft['DirectoryNames'])
  end
end
