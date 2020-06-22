describe 'Tools breadcrumbs and header', reset_provider: true do
  before :all do
    @ingest_response, _concept_response, @native_id = publish_tool_draft(name: 'Tool Name')
  end

  before do
    login
    visit tool_path(@ingest_response['concept-id'])
  end

  # TODO: remove after CMR-6332
  after :all do
    delete_response = cmr_client.delete_tool('MMT_2', @native_id, 'token')

    raise unless delete_response.success?
  end

  context 'when viewing the breadcrumbs' do
    it 'displays the Tool Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tools')
        expect(page).to have_content('Tool Name')
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
