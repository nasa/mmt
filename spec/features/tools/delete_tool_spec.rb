describe 'Delete tool', reset_provider: true, js: true do
  before :all do
    @ingested_tool, _concept_response, _native_id_1 = publish_tool_draft

    @ingested_tool_for_delete_messages, _concept_response, @native_id_2 = publish_tool_draft
  end

  # Remove this section after CMR-6332 is resolved
  after :all do
    delete_response = cmr_client.delete_tool('MMT_2', @native_id_2, 'token')
    # First tool should be deleted in the delete test

    raise unless delete_response.success?
  end

  before do
    login
  end

  context 'when viewing a published tool' do
    before do
      visit tool_path(@ingested_tool['concept-id'])
    end

    it 'displays a delete link' do
      expect(page).to have_content('Delete Tool Record')
    end

    context 'when clicking the delete link' do
      before do
        click_on 'Delete Tool Record'
      end

      it 'displays a confirmation modal' do
        expect(page).to have_content('Are you sure you want to delete this tool record?')
      end

      context 'when clicking Yes' do
        before do
          within '#delete-record-modal' do
            click_on 'Yes'
          end
        end

        it 'redirects to the revisions page and displays a confirmation message' do
          expect(page).to have_content('Revision History')

          expect(page).to have_content('Tool Deleted Successfully!')
        end
      end
    end
  end

  context 'when deleting the tool will fail' do
    before do
      visit tool_path(@ingested_tool_for_delete_messages['concept-id'])
    end

    context 'when CMR provides a message' do
      before do
        error_body = '{"errors": ["You do not have permission to perform that action."]}'
        error_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse(error_body), response_headers: {}))
        allow_any_instance_of(Cmr::CmrClient).to receive(:delete_tool).and_return(error_response)

        click_on 'Delete Tool Record'

        within '#delete-record-modal' do
          click_on 'Yes'
        end
      end

      it 'displays the CMR error message' do
        expect(page).to have_css('.eui-banner--danger', text: 'You do not have permission to perform that action.')
      end
    end

    context 'when CMR does not provide a message' do
      before do
        error_body = '{"message": "useless message"}'
        error_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse(error_body), response_headers: {}))
        allow_any_instance_of(Cmr::CmrClient).to receive(:delete_tool).and_return(error_response)

        click_on 'Delete Tool Record'

        within '#delete-record-modal' do
          click_on 'Yes'
        end
      end

      it 'displays the CMR error message' do
        expect(page).to have_css('.eui-banner--danger', text: 'Tool was not deleted successfully')
      end
    end
  end
end
