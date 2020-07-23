describe 'Creating a tool draft from cloning a tool', reset_provider: true, js: true do
  before :all do
    @ingest_response, _concept_response, @native_id = publish_tool_draft
  end

  after :all do
    delete_response = cmr_client.delete_tool('MMT_2', @native_id, 'token')

    raise unless delete_response.success?
  end

  context 'when cloning a published tool' do
    before do
      login

      visit tool_path(@ingest_response['concept-id'])

      click_on 'Clone Tool Record'
    end

    it 'displays the draft preview page' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
      end

      expect(page).to have_content('Publish Tool Draft')
      expect(page).to have_content('Delete Tool Draft')
      expect(page).to have_content('Metadata Fields')
      expect(page).to have_content('Tool Information')
    end

    it 'removes the Name and Long Name from the metadata' do
      within '#tool_draft_draft_name_preview' do
        expect(page).to have_css('p', text: 'No value for Name provided.')
      end

      within '#tool_draft_draft_long_name_preview' do
        expect(page).to have_css('p', text: 'No value for Long Name provided.')
      end
    end

    it 'creates a new native id for the draft' do
      draft = ToolDraft.last
      expect(draft.native_id).to eq("mmt_tool_#{draft.id}")
    end

    it 'displays a message that the draft needs a unique Name' do
      expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
    end

    context 'when clicking the banner message to enter a new Name' do
      before do
        click_on 'Click here to enter a new Name and Long Name.'
      end

      it 'displays the empty Name and Long Name fields' do
        expect(page).to have_field('Name', with: '')
        expect(page).to have_field('Long Name', with: '')
      end
    end
  end
end
