# MMT-1571
describe 'Removed field', js: true do
  let(:draft_before_save) { create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first) }
  before do
    login
    visit edit_collection_draft_path(draft_before_save)
    within '.nav-top' do
      click_on 'Save'
    end
  end

  it 'collection draft should contain the same DirectoryNames' do
    draft_after_save = CollectionDraft.first
    expect(draft_after_save.draft['DirectoryNames']).to eql(draft_before_save.draft['DirectoryNames'])
  end
end
