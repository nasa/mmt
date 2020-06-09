describe 'Valid Tool Drafts breadcrumbs' do
  let(:tool_draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { tool_draft.draft }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when viewing the breadcrumbs' do
    it 'displays the name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content(draft['Name'])
      end
    end
  end

  context 'when viewing the header' do
    it 'has "Manage Tools" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Tools')
      end
    end
  end
end
