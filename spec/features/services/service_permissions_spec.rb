require 'rails_helper'

describe 'Services permissions', reset_provider: true, js: true do
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when viewing a service' do
    before do
      login
    end

    context "when the service's provider is in the users available providers" do
      before :all do
        @ingested_service, _concept_response = publish_service_draft
        @ingested_service_for_delete_modal, _concept_response = publish_service_draft
      end

      before do
        user = User.first
        user.provider_id = 'MMT_1'
        user.available_providers = %w(MMT_1 MMT_2)
        user.save

        visit service_path(@ingested_service['concept-id'])
      end

      it 'displays the action links' do
        expect(page).to have_link('Edit Service Record')
        # expect(page).to have_link('Clone Service Record')
        # expect(page).to have_link('Delete Service Record')
      end

      context 'when clicking the edit link' do
        before do
          click_on 'Edit Service Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Editing this service #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            # click_on 'Yes'
            find('.not-current-provider-link').click
            wait_for_ajax
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'creates a draft from the service' do
            expect(page).to have_content('Service Draft Created Successfully!')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
          end
        end
      end

      # context 'when clicking the clone link' do
      #   before do
      #     click_on 'Clone Service Record'
      #   end
      #
      #   it 'displays a modal informing the user they need to switch providers' do
      #     expect(page).to have_content("Cloning this service #{modal_text}")
      #   end
      #
      #   context 'when clicking Yes' do
      #     before do
      #       find('.not-current-provider-link').click
      #       wait_for_ajax
      #     end
      #
      #     it 'switches the provider context' do
      #       expect(User.first.provider_id).to eq('MMT_2')
      #     end
      #
      #     it 'creates a draft from the service' do
      #       expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
      #       expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
      #     end
      #   end
      # end
      #
      # context 'when clicking the Manage Collection Associations link' do
      #   before do
      #     click_on 'Manage Collection Associations'
      #   end
      #
      #   it 'displays a modal informing the user they need to switch providers' do
      #     expect(page).to have_content("Managing this service's collection associations #{modal_text}")
      #   end
      #
      #   context 'when clicking Yes' do
      #     before do
      #       find('.not-current-provider-link').click
      #       wait_for_ajax
      #     end
      #
      #     it 'switches the provider context' do
      #       expect(User.first.provider_id).to eq('MMT_2')
      #     end
      #
      #     it 'displays the Manage Collection Associations page' do
      #       within '.eui-breadcrumbs' do
      #         expect(page).to have_content('Services')
      #         expect(page).to have_content('Collection Associations')
      #       end
      #       expect(page).to have_link('Add Collection Associations')
      #     end
      #   end
      # end
      #
      # context 'when clicking the delete link' do
      #   context 'when the service has no associated collections' do
      #     before do
      #       visit service_path(@ingested_service_for_delete_modal['concept-id'])
      #
      #       click_on 'Delete Service Record'
      #     end
      #
      #     it 'displays a modal informing the user they need to switch providers' do
      #       expect(page).to have_content("Deleting this service #{modal_text}")
      #     end
      #
      #     it 'does not display a message about collection associations that will also be deleted' do
      #       expect(page).to have_no_content('This service is associated with')
      #       expect(page).to have_no_content('collections. Deleting this service will also delete the collection associations')
      #     end
      #
      #     context 'when the service has associated collections' do
      #       before :all do
      #         ingested_collection_1, concept_response_1 = publish_collection_draft
      #         ingested_collection_2, concept_response_2 = publish_collection_draft
      #
      #         create_service_collection_association(@ingested_service_for_delete_modal['concept-id'],
      #                                                ingested_collection_1['concept-id'],
      #                                                ingested_collection_2['concept-id'])
      #       end
      #
      #       before do
      #         visit service_path(@ingested_service_for_delete_modal['concept-id'])
      #
      #         click_on 'Delete Service Record'
      #       end
      #
      #       it 'displays a modal informing the user they need to switch providers' do
      #         expect(page).to have_content(modal_text)
      #       end
      #
      #       it 'informs the user of the number of collection associations that will also be deleted' do
      #         # 2 associations created
      #         expect(page).to have_content('This service is associated with 2 collections. Deleting this service will also delete the collection associations')
      #       end
      #     end
      #   end
      #
      #   context 'when deleting the service' do
      #     before do
      #       ingested_service_to_delete, _concept_response = publish_service_draft
      #
      #       visit service_path(ingested_service_to_delete['concept-id'])
      #
      #       click_on 'Delete Service Record'
      #
      #       find('.not-current-provider-link').click
      #       wait_for_ajax
      #     end
      #
      #     it 'switches the provider context' do
      #       expect(User.first.provider_id).to eq('MMT_2')
      #     end
      #
      #     it 'deletes the record' do
      #       expect(page).to have_content('Service Deleted Successfully!')
      #     end
      #   end
      # end

      context 'when trying to visit the action paths directly' do
        context 'when visiting the edit path directly' do
          before do
            edit_link = page.current_path + '/edit'
            visit edit_link
          end

          it 'displays warning banner link to change provider' do
            expect(page).to have_css('.eui-banner--warn')
            expect(page).to have_content('You need to change your current provider to edit this service')
          end

          context 'when clicking the warning banner link' do
            before do
              click_link('You need to change your current provider to edit this service')
              wait_for_ajax
            end

            it 'switches the provider context' do
              expect(User.first.provider_id).to eq('MMT_2')
            end

            it 'creates a draft from the service' do
              expect(page).to have_content('Service Draft Created Successfully!')
              expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
            end
          end
        end

        # context 'when visiting the clone path directly' do
        #   before do
        #     clone_link = page.current_path + '/clone'
        #     visit clone_link
        #   end
        #
        #   it 'displays warning banner link to change provider' do
        #     expect(page).to have_css('.eui-banner--warn')
        #     expect(page).to have_content('You need to change your current provider to clone this service')
        #   end
        #
        #   context 'when clicking the warning banner link' do
        #     before do
        #       click_link('You need to change your current provider to clone this service')
        #       wait_for_ajax
        #     end
        #
        #     it 'switches the provider context' do
        #       expect(User.first.provider_id).to eq('MMT_2')
        #     end
        #
        #     it 'creates a draft from the service' do
        #       expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
        #       expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
        #     end
        #   end
        # end
        #
        # context 'when visiting the manage collection associations path directly' do
        #   before do
        #     collection_associations_link = page.current_path + '/collection_associations'
        #     visit collection_associations_link
        #   end
        #
        #   it 'displays warning banner link to change provider' do
        #     expect(page).to have_css('.eui-banner--warn')
        #     expect(page).to have_content('You need to change your current provider to manage collection associations for this service')
        #   end
        #
        #   context 'when clicking the warning banner link' do
        #     before do
        #       click_link('You need to change your current provider to manage collection associations for this service')
        #       wait_for_ajax
        #     end
        #
        #     it 'switches the provider context' do
        #       expect(User.first.provider_id).to eq('MMT_2')
        #     end
        #
        #     it 'displays the service manage collection associations page' do
        #       within '.eui-breadcrumbs' do
        #         expect(page).to have_content('Services')
        #         expect(page).to have_content('Collection Associations')
        #       end
        #       expect(page).to have_link('Add Collection Associations')
        #     end
        #   end
        # end
      end
    end

    context 'when the services provider is not in the users available providers' do
      before do
        @ingested_not_available_provider_service, _concept_response = publish_service_draft(provider_id: 'SEDAC')

        visit service_path(@ingested_not_available_provider_service['concept-id'])
      end

      it 'does not display the action links' do
        expect(page).to have_no_link('Edit Service Record')
        # expect(page).to have_no_link('Clone Service Record')
        # expect(page).to have_no_link('Delete Service Record')
      end

      context 'when trying to visit the action paths directly' do
        context 'when visiting the edit path directly' do
          before do
            edit_link = page.current_path + '/edit'
            visit edit_link
          end

          it 'displays the no permissions banner message' do
            expect(page).to have_css('.eui-banner--danger')
            expect(page).to have_content("You don't have the appropriate permissions to edit this service")
          end

          it 'displays the Access Denied message' do
            expect(page).to have_content('Access Denied')
            expect(page).to have_content('It appears you do not have access to edit this content.')
          end
        end

        # context 'when visiting the clone path directly' do
        #   before do
        #     clone_link = page.current_path + '/clone'
        #     visit clone_link
        #   end
        #
        #   it 'displays the no permissions banner message' do
        #     expect(page).to have_css('.eui-banner--danger')
        #     expect(page).to have_content("You don't have the appropriate permissions to clone this service")
        #   end
        #
        #   it 'displays the Access Denied message' do
        #     expect(page).to have_content('Access Denied')
        #     expect(page).to have_content('It appears you do not have access to clone this content.')
        #   end
        # end
        #
        # context 'when visiting the collection associations path directly' do
        #   before do
        #     collection_associations_link = page.current_path + '/collection_associations'
        #     visit collection_associations_link
        #   end
        #
        #   it 'displays the no permissions banner message' do
        #     expect(page).to have_css('.eui-banner--danger')
        #     expect(page).to have_content("You don't have the appropriate permissions to manage collection associations for this service")
        #   end
        #
        #   it 'displays the Access Denied message' do
        #     expect(page).to have_content('Access Denied')
        #     expect(page).to have_content('It appears you do not have access to manage collection associations for this content.')
        #   end
        # end
      end
    end
  end
end
