require 'rails_helper'

describe 'Viewing a service' do
  # this test is for the unusual case when retrieving the concept works but
  # the search endpoint returns an empty response. this has happened when the
  # CMR elasticsearch indexer was not functioning properly

  service_name = "#{Faker::HitchhikersGuideToTheGalaxy.location}_#{Faker::Number.number(6)}".truncate(20)
  long_name = "Long Detailed Description of Useful Gas and Ratio Test Search Var #{Faker::Number.number(6)}"

  before :all do
    @ingest_response, _concept_response = publish_service_draft(name: service_name, long_name: long_name)
  end

  before do
    login
  end

  context 'when the endpoints all work properly' do
    context 'when visiting the show page of a published service' do
      before do
        visit service_path(@ingest_response['concept-id'])
      end

      it 'displays the service preview page with the service information' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Services')
          expect(page).to have_content(service_name)
        end

        within '#service_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_css('p', text: service_name)
        end

        within '#service_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')
          expect(page).to have_css('p', text: long_name)
        end
      end
    end

    context 'when visiting the show page of a non-existent service' do
      before do
        visit service_path('fake-concept-id')
      end

      it 'displays the service show page with no data' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Services')
          expect(page).to have_content('<Blank Name>')
        end

        within '#service_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_css('p', text: 'No value for Name provided')
        end

        within '#service_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')
          expect(page).to have_css('p', text: 'No value for Long Name provided')
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
        service_response = cmr_success_response(empty_search_response)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_services).and_return(service_response)
      end

      context 'when visiting the show page of a published service' do
        before do
          visit service_path(@ingest_response['concept-id'])
        end

        it 'displays the service preview page with the service information' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Services')
            expect(page).to have_content(service_name)
          end

          within '#service_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_css('p', text: service_name)
          end

          within '#service_long_name_preview' do
            expect(page).to have_css('h5', text: 'Long Name')
            expect(page).to have_css('p', text: long_name)
          end
        end
      end
    end
  end
end
