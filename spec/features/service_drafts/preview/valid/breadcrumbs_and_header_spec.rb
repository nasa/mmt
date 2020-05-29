describe 'Service drafts valid breadcrumbs and header' do
  before do
    login
    @draft = create(:full_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit service_draft_path(@draft)
  end

  context 'when viewing the breadcrumbs' do
    it 'displays the name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content(@draft.draft['Name'])
      end
    end
  end

  context 'when viewing the header' do
    it 'has "Manage Services" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Services')
      end
    end
  end
end
