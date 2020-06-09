describe 'Service drafts empty breadcrumbs' do
  before do
    login
    @draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit service_draft_path(@draft)
  end

  context 'when viewing the breadcrumbs' do
    it 'displays Blank Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('<Blank Name>')
      end
    end
  end
end
