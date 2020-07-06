describe 'Create new draft from tool', reset_provider: true do
  context 'when editing a published tool' do
    before do
      login

      ingest_response, _concept_response, @native_id = publish_tool_draft(name: 'Test Tool')

      visit tool_path(ingest_response['concept-id'])

      click_on 'Edit Tool Record'
    end

    # TODO: remove after CMR-6332
    after do
      delete_response = cmr_client.delete_tool('MMT_2', @native_id, 'token')

      raise unless delete_response.success?
    end

    it 'displays a confirmation message on the tool draft preview page' do
      expect(page).to have_content('Tool Draft Created Successfully!')

      expect(page).to have_link('Publish Tool Draft')
      expect(page).to have_content('Test Tool')
    end

    context 'when publishing an update' do
      before do
        click_on 'Publish Tool Draft'
      end

      it 'the record has a second revision' do
        expect(page).to have_content('Tool Draft Published Successfully!')

        # TODO: Enable in MMT-2231
        # expect(page).to have_link('Revisions(2)')
      end
    end
  end
end
