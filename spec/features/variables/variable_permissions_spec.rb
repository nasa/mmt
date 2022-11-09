describe 'Variables permissions', js: true do
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when viewing a variable' do
    before do
      login
    end

    context "when the variable's provider is in the users available providers" do
      before :all do
        @collection_ingest_response, _collection_concept_response = publish_collection_draft

        @ingested_variable, _concept_response = publish_variable_draft(collection_concept_id: @collection_ingest_response['concept-id'])
        @ingested_variable_for_delete_modal, _concept_response = publish_variable_draft(collection_concept_id: @collection_ingest_response['concept-id'])
      end

      before do
        login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))

        visit variable_path(@ingested_variable['concept-id'])
      end

      it 'displays the action links' do
        expect(page).to have_link('Edit Variable Record')
        expect(page).to have_link('Clone Variable Record')
        expect(page).to have_link('Delete Variable Record')
      end

      context 'when clicking the edit link' do
        before do
          click_on 'Edit Variable Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Editing this variable #{modal_text}")
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

          it 'creates a draft from the variable' do
            expect(page).to have_content('Variable Draft Created Successfully!')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
          end
        end
      end

      context 'when clicking the clone link' do
        before do
          click_on 'Clone Variable Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Cloning this variable #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            find('.not-current-provider-link').click
            wait_for_jQuery
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'creates a draft from the variable' do
            expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
          end
        end
      end

      context 'when clicking the Manage Collection Association link' do
        before do
          click_on 'Manage Collection Association'
        end

        it 'displays the Manage Collection Association page' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Variables')
            expect(page).to have_content('Collection Association')
          end
          expect(page).to have_no_link('Add Collection Association')
        end
      end

      context 'when clicking the delete link' do
        before do
          visit variable_path(@ingested_variable_for_delete_modal['concept-id'])

          click_on 'Delete Variable Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content(modal_text)
        end

        it 'informs the user of the number of collection associations that will also be deleted' do
          # 1 association created
          expect(page).to have_content('This variable is associated with 1 collections. Deleting this variable will also delete the collection association')
        end

        context 'when deleting the variable' do
          before do
            ingested_variable_to_delete, _concept_response = publish_variable_draft(collection_concept_id: @collection_ingest_response['concept-id'])

            visit variable_path(ingested_variable_to_delete['concept-id'])

            click_on 'Delete Variable Record'

            find('.not-current-provider-link').click
            wait_for_jQuery
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'deletes the record' do
            expect(page).to have_content('Variable Deleted Successfully!')
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
            expect(page).to have_content('You need to change your current provider to edit this variable')
          end

          context 'when clicking the warning banner link' do
            before do
              click_link('You need to change your current provider to edit this variable')
              wait_for_jQuery
            end

            it 'switches the provider context' do
              expect(User.first.provider_id).to eq('MMT_2')
            end

            it 'creates a draft from the variable' do
              expect(page).to have_content('Variable Draft Created Successfully!')
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
            expect(page).to have_content('You need to change your current provider to clone this variable')
          end

          context 'when clicking the warning banner link' do
            before do
              click_link('You need to change your current provider to clone this variable')
              wait_for_jQuery
            end

            it 'switches the provider context' do
              expect(User.first.provider_id).to eq('MMT_2')
            end

            it 'creates a draft from the variable' do
              expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
              expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
            end
          end
        end

        context 'when visiting the manage collection associations path directly' do
          before do
            collection_associations_link = page.current_path + '/collection_associations'
            visit collection_associations_link
          end

          it 'displays the variable manage collection associations page' do
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Variables')
              expect(page).to have_content('Collection Association')
            end
          end
        end
      end
    end

    context 'when the variables provider is not in the users available providers' do
      before do
        collection_sedac_ingest_response, _collection_sedac_concept_response = publish_collection_draft(provider_id: 'SEDAC')
        @ingested_not_available_provider_variable, _concept_response = publish_variable_draft(provider_id: 'SEDAC', collection_concept_id: collection_sedac_ingest_response['concept-id'])

        visit variable_path(@ingested_not_available_provider_variable['concept-id'])
      end

      it 'does not display the action links' do
        expect(page).to have_no_link('Edit Variable Record')
        expect(page).to have_no_link('Clone Variable Record')
        expect(page).to have_no_link('Delete Variable Record')
      end

      context 'when trying to visit the action paths directly' do
        context 'when visiting the edit path directly' do
          before do
            edit_link = page.current_path + '/edit'
            visit edit_link
          end

          it 'displays the no permissions banner message' do
            expect(page).to have_css('.eui-banner--danger')
            expect(page).to have_content("You don't have the appropriate permissions to edit this variable")
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
            expect(page).to have_content("You don't have the appropriate permissions to clone this variable")
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
