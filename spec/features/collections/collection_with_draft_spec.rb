require 'rails_helper'

describe 'Collection with draft' do
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when viewing a collection that has an open draft' do
    before do
      login
    end

    context 'when the collections provider is the users current provider', js: true do
      before do
        ingest_response, @concept_response = publish_draft(include_new_draft: true)

        visit collection_path(ingest_response['concept-id'])
      end

      it 'displays a message that a draft exists' do
        expect(page).to have_content('This collection has an open draft associated with it. Click here to view it.')
      end

      context 'when clicking the link' do
        before do
          click_on 'Click here to view it.'
        end

        it 'displays the draft' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Drafts')
            expect(page).to have_content("#{@concept_response.body['ShortName']}_1")
          end

          expect(page).to have_content("#{@concept_response.body['ShortName']}_1 #{@concept_response.body['EntryTitle']}")
        end
      end
    end

    context 'when the collections provider is in the users available providers', js: true do
      before do
        ingest_response, @concept_response = publish_draft(include_new_draft: true)

        user = User.first
        user.provider_id = 'MMT_1'
        user.available_providers = %w(MMT_1 MMT_2)
        user.save

        visit collection_path(ingest_response['concept-id'])
      end

      it 'displays a message that a draft exists' do
        expect(page).to have_content('This collection has an open draft associated with it. Click here to view it.')
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
            wait_for_ajax
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'displays the draft' do
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Drafts')
              expect(page).to have_content("#{@concept_response.body['ShortName']}_1")
            end

            expect(page).to have_content("#{@concept_response.body['ShortName']}_1 #{@concept_response.body['EntryTitle']}")
            # expect(page).to have_content("#{@concept_response.body['ShortName']}_1 #{@concept_response.body['EntryTitle']} DRAFT RECORD")
          end
        end
      end
    end

    context 'when the collections provider is not in the users available providers' do
      before do
        ingest_response, @concept_response = publish_draft(include_new_draft: true)

        user = User.first
        user.provider_id = 'SEDAC'
        user.available_providers = %w(SEDAC)
        user.save

        visit collection_path(ingest_response['concept-id'])
      end

      it 'does not display a message that a draft exists' do
        expect(page).to have_no_content('This collection has an open draft associated with it. Click here to view it.')
      end
    end
  end
end
