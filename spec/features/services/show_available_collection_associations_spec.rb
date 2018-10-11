require 'rails_helper'

describe 'Show Available Service Collection Associations', js: true, reset_provider: true do
  before do
    login
  end
  context 'when there are paginated collection associations' do
    before do
      # publish a service
      @service_ingest_response, _concept_response = publish_service_draft

      # mock for all collections associated to this service
      collection_associations_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/services/service_associated_collections.json'))))
      options_2 = {page_size: 2000, page_num: 1, service_concept_id: @service_ingest_response['concept-id']}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(options_2, 'access_token').and_return(collection_associations_response)

      # mock for all collections associated to this service
      options = {service_concept_id: @service_ingest_response['concept-id']}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(options, 'access_token').and_return(collection_associations_response)

      # mock for available collections for provider
      provider_collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/services/provider_collections.json'))))
      options_1 = {page_size: 500, provider: 'MMT_2', 'entry_title' => '*', 'options' => {'entry_title' => {'pattern' => true, 'ignore_case' => true}}}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(options_1, 'access_token').and_return(provider_collections_response)

      visit new_service_collection_association_path(@service_ingest_response['concept-id'])

    end

    context 'when clicking button submit' do
      before do
        within '#collection-search' do
          select 'Entry Title', from: 'Search Field'
          find(:css, "input[id$='query_text']").set('*')
          click_button 'Submit'
        end
      end
      it 'displays the collection assiciations' do
        expect(page).to have_content('Disabled rows')
        expect(page).to have_selector('tbody tr', count: 27)
      end
    end

  end
end