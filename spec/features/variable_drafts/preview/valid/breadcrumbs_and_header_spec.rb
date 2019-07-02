describe 'Variable drafts valid breadcrumbs and header' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'when viewing the breadcrumbs' do
    it 'displays the name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content(@draft.draft['Name'])
      end
    end
  end

  context 'when viewing the header' do
    it 'has "Manage Variables" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Variables')
      end
    end
  end
end
