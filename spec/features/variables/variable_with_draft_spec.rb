describe 'Variable with draft' do
  modal_text = 'requires you change your provider context to MMT_2'

  before :all do
    @ingest_collection_response, _collection_concept_response = publish_collection_draft
  end

  before do
    login
  end
  context 'when viewing a variable that has an open draft' do
    context 'when the variables provider is the users current provider', js: true do
      before do
        ingest_response, @concept_response = publish_variable_draft(include_new_draft: true, collection_concept_id: @ingest_collection_response['concept-id'])

        visit variable_path(ingest_response['concept-id'])
      end

      it 'displays a message that a draft exists' do
        expect(page).to have_content('This variable has an open draft associated with it. Click here to view it.')
      end

      context 'when clicking the link' do
        before do
          click_on 'Click here to view it.'
        end

        it 'displays the draft' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Variable Drafts')
            expect(page).to have_content(@concept_response.body['Name'])
          end

          expect(page).to have_content(@concept_response.body['Name'])
          expect(page).to have_content(@concept_response.body['LongName'])
        end

        it 'displays the Collection Association progress icons correctly' do
          within '#collection-association-progress' do
            within '.status' do
              expect(page).to have_css('.eui-icon.icon-green.eui-check')
            end

            within '.progress-indicators' do
              expect(page).to have_css('.eui-icon.eui-required.icon-green.collection_association')
            end
          end
        end

        it 'displays the correct Collection Association form links' do
          within '#collection-association-progress' do
            expect(page).to have_link('Collection Association', href: '#')

            within '.progress-indicators' do
              expect(page).to have_link('Collection Association - Required', href: '#')
            end
          end
        end

        context 'when clicking on the Collection Association form link' do
          before do
            click_on 'Collection Association'
          end

          it 'does not leave the preview page' do
            expect(page).to have_content('Publish Variable Draft')
            expect(page).to have_content('Metadata Fields')
            expect(page).to have_content('Variable Information')

            expect(page).to have_no_css('#variable-draft-collection-association-table')
            expect(page).to have_no_select('Search Field')
            expect(page).to have_no_css("input[id$='query_text']")
          end
        end
      end
    end

    context 'when the variables provider is in the users available providers', js: true do
      before do
        ingest_response, @concept_response = publish_variable_draft(include_new_draft: true, collection_concept_id: @ingest_collection_response['concept-id'])

        login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))

        visit variable_path(ingest_response['concept-id'])
      end

      it 'displays a message that a draft exists' do
        expect(page).to have_content('This variable has an open draft associated with it. Click here to view it.')
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
              expect(page).to have_content('Variable Drafts')
              expect(page).to have_content(@concept_response.body['Name'])
            end

            expect(page).to have_content("#{@concept_response.body['Name']}")
            expect(page).to have_content("#{@concept_response.body['LongName']}")
          end
        end
      end
    end

    context 'when the variables provider is not in the users available providers' do
      before do
        ingest_response, @concept_response = publish_variable_draft(include_new_draft: true, collection_concept_id: @ingest_collection_response['concept-id'])

        login(provider: 'SEDAC', providers: %w(SEDAC))

        visit variable_path(ingest_response['concept-id'])
      end

      it 'does not display a message that a draft exists' do
        expect(page).to have_content('This variable has an open draft associated with it. However, it appears you do not have access to the open draft.')
      end
    end
  end
end
