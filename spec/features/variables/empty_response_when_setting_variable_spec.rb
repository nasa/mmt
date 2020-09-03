describe 'Viewing a variable' do
  # this test is for the unusual case when retrieving the concept works but
  # the search endpoint returns an empty response. this has happened when the
  # CMR elasticsearch indexer was not functioning properly

  let(:variable_name) { "Useful Gas and Ratio Test Search Var #{Faker::Number.number(digits: 6)}" }
  let(:long_name) { "Long Detailed Description of Useful Gas and Ratio Test Search Var #{Faker::Number.number(digits: 6)}" }

  before :all do
    ingest_collection_response, _collection_concept_response = publish_collection_draft
    @ingest_response, _concept_response = publish_variable_draft(name: variable_name, long_name: long_name, collection_concept_id: ingest_collection_response['concept-id'])
  end

  before do
    login
  end

  context 'when the endpoints all work properly' do
    context 'when visiting the show page of a published variable' do
      before do
        visit variable_path(@ingest_response['concept-id'])
      end

      it 'displays the variable preview page with the variable information' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variables')
          expect(page).to have_content(variable_name)
        end

        within '#variable_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_css('p', text: variable_name)
        end

        within '#variable_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')
          expect(page).to have_css('p', text: long_name)
        end
      end
    end

    context 'when visiting the show page of a non-existent variable' do
      before do
        # This fake concept-id still needs to have a 'V' to get parsed through
        # set-metadata correctly.
        visit variable_path('Var-fake-concept-id')
      end

      it 'displays the variable show page with no data' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variables')
          expect(page).to have_content('<Blank Name>')
        end
      end

      it 'notifies the user the UMM version cannot be verified' do
        within '.eui-banner--warn' do
          expect(page).to have_content('We cannot confirm the UMM version of this variable')
        end

        within '.no-access' do
          expect(page).to have_content('Unconfirmed UMM Version')
          expect(page).to have_content('It appears we currently cannot confirm the UMM version of this variable. In order to prevent unintentional data loss, editing this variable is currently unavailable. Please try again or contact Earthdata Support')
        end
      end
    end
  end

  context 'when the endpoint for retrieving concepts works properly but the search endpoint does not' do
    context 'when the response is successful but empty' do
      let(:empty_search_response) do
        {
          'hits': 0,
          'took': 5,
          'items': []
        }.to_json
      end

      before do
        variable_response = cmr_success_response(empty_search_response)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_variables).and_return(variable_response)
      end

      context 'when visiting the show page of a published variable' do
        before do
          visit variable_path(@ingest_response['concept-id'])
        end

        it 'displays the variable preview page with the variable information' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Variables')
            expect(page).to have_content(variable_name)
          end

          within '#variable_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_css('p', text: variable_name)
          end

          within '#variable_long_name_preview' do
            expect(page).to have_css('h5', text: 'Long Name')
            expect(page).to have_css('p', text: long_name)
          end
        end
      end
    end
  end
end
