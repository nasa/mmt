describe 'Variable drafts empty breadcrumbs' do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit variable_draft_path(variable_draft)
  end

  context 'when viewing the breadcrumbs' do
    it 'displays Blank Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('<Blank Name>')
      end
    end
  end
end
