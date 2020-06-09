describe 'Valid Service Drafts breadcrumbs and header' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { service_draft.draft }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'when viewing the breadcrumbs' do
    it 'displays the name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content(draft['Name'])
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
