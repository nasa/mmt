describe 'Services breadcrumbs and header' do
  before :all do
    @ingest_response, _concept_response = publish_service_draft(name: 'Service Name')
  end

  before do
    login
    visit service_path(@ingest_response['concept-id'])
  end

  context 'when viewing the breadcrumbs' do
    it 'displays the Service Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Services')
        expect(page).to have_content('Service Name')
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
