describe 'Tool with draft', reset_provider: true do
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when viewing a tool that has an open draft' do
    before do
      login
    end

    context 'when the tools provider is the users current provider', js: true do
      before do
        ingest_response, @concept_response, @native_id = publish_tool_draft(include_new_draft: true)

        visit tool_path(ingest_response['concept-id'])
      end

      # TODO: remove after CMR-6332
      after do
        delete_response = cmr_client.delete_tool('MMT_2', @native_id, 'token')

        raise unless delete_response.success?
      end

      it 'displays a message that a draft exists' do
        expect(page).to have_content('This tool has an open draft associated with it. Click here to view it.')
      end

      context 'when clicking the link' do
        before do
          click_on 'Click here to view it.'
        end

        it 'displays the draft' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Tool Drafts')
            expect(page).to have_content("#{@concept_response.body['Name']}_#{@concept_response.body['Version']}")
          end

          expect(page).to have_content("#{@concept_response.body['Name']}_#{@concept_response.body['Version']}")
          expect(page).to have_content("#{@concept_response.body['LongName']}")
        end
      end
    end

    context 'when the tools provider is in the users available providers', js: true do
      before do
        ingest_response, @concept_response, @native_id = publish_tool_draft(include_new_draft: true)

        login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))

        visit tool_path(ingest_response['concept-id'])
      end

      # TODO: remove after CMR-6332
      after do
        delete_response = cmr_client.delete_tool('MMT_2', @native_id, 'token')

        raise unless delete_response.success?
      end

      it 'displays a message that a draft exists' do
        expect(page).to have_content('This tool has an open draft associated with it. Click here to view it.')
      end

      context 'when clicking the link' do
        before do
          click_on 'Click here to view it.'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Viewing this draft #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            # click_on 'Yes'
            find('.not-current-provider-link').click
            wait_for_jQuery
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'displays the draft' do
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Tool Drafts')
              expect(page).to have_content(@concept_response.body['Name'])
            end

            expect(page).to have_content("#{@concept_response.body['Name']}_#{@concept_response.body['Version']}")
            expect(page).to have_content("#{@concept_response.body['LongName']}")
          end
        end
      end
    end

    context 'when the tools provider is not in the users available providers' do
      before do
        ingest_response, @concept_response, @native_id = publish_tool_draft(include_new_draft: true)

        login(provider: 'SEDAC', providers: %w(SEDAC))

        visit tool_path(ingest_response['concept-id'])
      end

      # TODO: remove after CMR-6332
      after do
        delete_response = cmr_client.delete_tool('MMT_2', @native_id, 'token')

        raise unless delete_response.success?
      end

      it 'does not display a message that a draft exists' do
        expect(page).to have_content('This tool has an open draft associated with it. However, it appears you do not have access to the open draft.')
        expect(page).to have_content('If you feel you should have access, please check with your provider manager or ensure that you are logged into the correct provider.')
      end
    end
  end
end
