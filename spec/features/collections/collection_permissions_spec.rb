require 'rails_helper'

describe 'Collections permissions', js: true, reset_provider: true do
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when viewing a collection' do
    before do
      login
      publish_draft(2)
    end

    context 'when the collections provider is in the users available providers' do
      before do
        user = User.first
        user.provider_id = 'MMT_1'
        user.available_providers = %w(MMT_1 MMT_2)
        user.save

        fill_in 'Quick Find', with: 'MMT_2'
        click_on 'Find'

        click_on '12345'
      end

      it 'displays the action links' do
        expect(page).to have_content('EDIT RECORD')
        expect(page).to have_content('Clone this Record')
        expect(page).to have_content('Delete Record')
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
            sleep 0.2
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
            sleep 0.2
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'creates a draft from the collection' do
            expect(page).to have_link('Records must have a unique Short Name. Click here to enter a new Short Name.')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(2)
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
            sleep 0.2
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
          click_on 'Revisions (2)'
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
              sleep 0.2
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
    end

    context 'when the collections provider is not in the users available providers' do
      before do
        fill_in 'Quick Find', with: 'ACR3L2DM'
        click_on 'Find'

        click_on 'ACR3L2DM'
      end

      it 'does not display the action links' do
        expect(page).to have_no_content('EDIT RECORD')
        expect(page).to have_no_content('Clone this Record')
        expect(page).to have_no_content('Delete Record')
      end

      context 'when viewing the revisions page' do
        before do
          click_on 'Revisions (2)'
        end

        it 'does not display the revert link' do
          expect(page).to have_no_content('Revert to this Revision')
        end
      end
    end
  end
end
