require 'rails_helper'

describe 'Collections permissions', js: true do
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when viewing a collection' do
    before do
      login
    end

    context 'when the collections provider is in the users available providers' do
      before do
        ingest_response, concept_response = publish_draft(revision_count: 2)

        user = User.first
        user.provider_id = 'MMT_1'
        user.available_providers = %w(MMT_1 MMT_2)
        user.save

        visit collection_path(ingest_response['concept-id'])
      end

      it 'displays the action links' do
        expect(page).to have_link('Edit Record')
        expect(page).to have_link('Clone this Record')
        expect(page).to have_link('Delete Record')
      end

      context 'when clicking the edit link' do
        before do
          click_on 'Edit Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Editing this collection #{modal_text}")
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

          it 'creates a draft from the collection' do
            expect(page).to have_content('Draft was successfully created')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
          end
        end
      end

      context 'when clicking the clone link' do
        before do
          click_on 'Clone this Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Cloning this collection #{modal_text}")
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

          it 'creates a draft from the collection' do
            expect(page).to have_link('Records must have a unique Short Name. Click here to enter a new Short Name.')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
          end
        end
      end

      context 'when clicking the delete link' do
        before do
          click_on 'Delete Record'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Deleting this collection #{modal_text}")
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
            expect(page).to have_content('Collection was successfully deleted')
          end
        end
      end

      context 'when viewing the revisions page' do
        before do
          within '.cta' do
            click_on 'Revisions'
          end
        end

        it 'displays the revert link' do
          expect(page).to have_content('Revert to this Revision')
        end

        context 'when clicking the revert link' do
          before do
            click_on 'Revert to this Revision'
          end

          it 'displays a modal informing the user they need to switch providers' do
            expect(page).to have_content("Reverting this collection #{modal_text}")
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

            it 'reverts the collection' do
              expect(page).to have_content('Revision was successfully created')
              expect(page).to have_content('Published', count: 1)
              expect(page).to have_content('Revision View', count: 2)
              expect(page).to have_content('Revert to this Revision', count: 2)
            end
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
            expect(page).to have_content('You need to change your current provider to edit this collection')
          end

          context 'when clicking the warning banner link' do
            before do
              click_link('You need to change your current provider to edit this collection')
              wait_for_ajax
            end

            it 'switches the provider context' do
              expect(User.first.provider_id).to eq('MMT_2')
            end

            it 'creates a draft from the collection' do
              expect(page).to have_content('Draft was successfully created')
              expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
            end
          end
        end

        context 'when visiting the clone link directly' do
          before do
            clone_link = page.current_path + '/clone'
            visit clone_link
          end

          it 'displays warning banner link to change provider' do
            expect(page).to have_css('.eui-banner--warn')
            expect(page).to have_content('You need to change your current provider to clone this collection')
          end

          context 'when clicking the warning banner link' do
            before do
              click_link('You need to change your current provider to clone this collection')
              wait_for_ajax
            end

            it 'switches the provider context' do
              expect(User.first.provider_id).to eq('MMT_2')
            end

            it 'creates a draft from the collection' do
              expect(page).to have_link('Records must have a unique Short Name. Click here to enter a new Short Name.')
              expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
            end
          end
        end
      end
    end

    context 'when the collections provider is not in the users available providers' do
      before do
        ingest_response, concept_response = publish_draft(revision_count: 2, provider_id: 'SEDAC')

        visit collection_path(ingest_response['concept-id'])
      end

      it 'does not display the action links' do
        expect(page).to have_no_link('Edit Record')
        expect(page).to have_no_link('Clone this Record')
        expect(page).to have_no_link('Delete Record')
      end

      context 'when viewing the revisions page' do
        before do
          within '.cta' do
            click_on 'Revisions'
          end
        end

        it 'does not display the revert link' do
          expect(page).to have_no_content('Revert to this Revision')
        end
      end

      context 'when trying to visit the action links directly' do

        context 'when visiting the edit link directly' do
          before do
            edit_link = page.current_path + '/edit'
            visit edit_link
          end

          it 'displays the no permissions banner message' do
            expect(page).to have_css('.eui-banner--danger')
            expect(page).to have_content("You don't have the appropriate permissions to edit this collection")
          end

          it 'displays the Access Denied message' do
            expect(page).to have_content('Access Denied')
            expect(page).to have_content('It appears you do not have access to edit this content.')
          end
        end

        context 'when visiting clone link directly' do
          before do
            clone_link = page.current_path + '/clone'
            visit clone_link
          end

          it 'displays the no permissions banner message' do
            expect(page).to have_css('.eui-banner--danger')
            expect(page).to have_content("You don't have the appropriate permissions to clone this collection")
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
