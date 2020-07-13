describe 'Tools permissions', reset_provider: true, js: true do
  let(:modal_text) { 'requires you change your provider context to MMT_2' }

  context 'when viewing a tool' do
    before do
      login
    end

    context "when the tool's provider is in the users available providers" do
      before :all do
        @ingested_tool, _concept_response, @native_id_1 = publish_tool_draft
        @ingested_tool_for_delete_modal, _concept_response, _native_id_2 = publish_tool_draft
      end

      after :all do
        delete_response = cmr_client.delete_tool('MMT_2', @native_id_1, 'token')
        # Second tool should be deleted in the delete test

        raise unless delete_response.success?
      end

      before do
        login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))

        visit tool_path(@ingested_tool['concept-id'])
      end

      it 'displays the action links' do
        expect(page).to have_link('Edit Tool Record')
        expect(page).to have_link('Clone Tool Record')
        expect(page).to have_link('Delete Tool Record')
      end

      context 'when clicking the edit link' do
        before do
          click_on 'Edit Tool Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Editing this tool #{modal_text}")
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

          it 'creates a draft from the tool' do
            expect(page).to have_content('Tool Draft Created Successfully!')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
          end
        end
      end

      context 'when clicking the clone link' do
        before do
          click_on 'Clone Tool Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Cloning this tool #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            find('.not-current-provider-link').click
            wait_for_jQuery
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'creates a draft from the tool' do
            expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
          end
        end
      end

      context 'when clicking the delete link' do
        before do
          login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))
          visit tool_path(@ingested_tool_for_delete_modal['concept-id'])

          click_on 'Delete Tool Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Deleting this tool #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            find('.not-current-provider-link').click
            wait_for_jQuery
          end

          it 'switches the provider context and deletes the record' do
            expect(User.first.provider_id).to eq('MMT_2')
            expect(page).to have_content('Tool Deleted Successfully!')
          end
        end
      end

      context 'when trying to visit the action paths directly' do
        context 'when visiting the edit path directly' do
          before do
            edit_link = page.current_path + '/edit'
            visit edit_link
          end

          it 'displays warning banner link to change provider' do
            expect(page).to have_css('.eui-banner--warn')
            expect(page).to have_content('You need to change your current provider to edit this tool')
          end

          context 'when clicking the warning banner link' do
            before do
              click_link('You need to change your current provider to edit this tool')
              wait_for_jQuery
            end

            it 'switches the provider context' do
              expect(User.first.provider_id).to eq('MMT_2')
            end

            it 'creates a draft from the tool' do
              expect(page).to have_content('Tool Draft Created Successfully!')
              expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
            end
          end
        end

        context 'when visiting the clone path directly' do
          before do
            clone_link = page.current_path + '/clone'
            visit clone_link
          end

          it 'displays warning banner link to change provider' do
            expect(page).to have_css('.eui-banner--warn')
            expect(page).to have_content('You need to change your current provider to clone this tool')
          end

          context 'when clicking the warning banner link' do
            before do
              click_link('You need to change your current provider to clone this tool')
              wait_for_jQuery
            end

            it 'switches the provider context' do
              expect(User.first.provider_id).to eq('MMT_2')
            end

            it 'creates a draft from the tool' do
              expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
              expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
            end
          end
        end
      end
    end

    context 'when the tools provider is not in the users available providers' do
      before do
        @ingested_not_available_provider_tool, _concept_response = publish_tool_draft(provider_id: 'SEDAC')

        visit tool_path(@ingested_not_available_provider_tool['concept-id'])
      end

      it 'does not display the action links' do
        expect(page).to have_no_link('Edit Tool Record')
        expect(page).to have_no_link('Clone Tool Record')
#       TODO: Uncomment in MMT-2229
#        expect(page).to have_no_link('Delete Tool Record')
      end

      context 'when trying to visit the action paths directly' do
        context 'when visiting the edit path directly' do
          before do
            edit_link = page.current_path + '/edit'
            visit edit_link
          end

          it 'displays the no permissions banner message' do
            expect(page).to have_css('.eui-banner--danger')
            expect(page).to have_content("You don't have the appropriate permissions to edit this tool")
          end

          it 'displays the Access Denied message' do
            expect(page).to have_content('Access Denied')
            expect(page).to have_content('It appears you do not have access to edit this content.')
          end
        end

        context 'when visiting the clone path directly' do
          before do
            clone_link = page.current_path + '/clone'
            visit clone_link
          end

          it 'displays the no permissions banner message' do
            expect(page).to have_css('.eui-banner--danger')
            expect(page).to have_content("You don't have the appropriate permissions to clone this tool")
          end

          it 'displays the Access Denied message' do
            expect(page).to have_content('Access Denied')
            expect(page).to have_content('It appears you do not have access to clone this content.')
          end
        end
      end
    end
  end
end
