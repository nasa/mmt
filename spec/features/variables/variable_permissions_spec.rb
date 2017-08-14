require 'rails_helper'

describe 'Variables permissions', js: true do
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when viewing a variable' do
    before do
      login
    end

    context 'when the variables provider is in the users available providers' do
      before do
        ingest_response = publish_variable_draft

        user = User.first
        user.provider_id = 'MMT_1'
        user.available_providers = %w(MMT_1 MMT_2)
        user.save

        visit variable_path(ingest_response['concept-id'])
      end

      it 'displays the action links' do
        expect(page).to have_link('Edit Variable Record')
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
            wait_for_ajax
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

      context 'when clicking the delete link' do
        before do
          click_on 'Delete Variable Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Deleting this variable #{modal_text}")
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

          it 'deletes the record' do
            expect(page).to have_content('Variable Deleted Successfully!')
          end
        end
      end

      context 'when trying to visit the action links directly' do
        context 'when visiting the edit link directly' do
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
              wait_for_ajax
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
      end
    end

    context 'when the variables provider is not in the users available providers' do
      before do
        ingest_response = publish_variable_draft(provider_id: 'SEDAC')

        visit variable_path(ingest_response['concept-id'])
      end

      it 'does not display the action links' do
        expect(page).to have_no_link('Edit Variable Record')
        expect(page).to have_no_link('Delete Variable Record')
      end

      context 'when trying to visit the action links directly' do
        context 'when visiting the edit link directly' do
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
      end
    end
  end
end
