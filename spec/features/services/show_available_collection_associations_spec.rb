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
      without_page_options = {service_concept_id: @service_ingest_response['concept-id']}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(without_page_options, 'access_token').and_return(collection_associations_response)

      # # mock for available collections page 1 for provider
      provider_collections_page_1_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/services/provider_collections_page_1.json'))))
      provider_page_1_options = {page_size: 25, provider: 'MMT_2', entry_title: '*', options: {entry_title: {pattern: true, ignore_case: true}}}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(provider_page_1_options, 'access_token').and_return(provider_collections_page_1_response)
      #
      # # mock for available collections page 2 for provider
      provider_collections_page_2_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/services/provider_collections_page_2.json'))))
      provider_page_2_options = {page_size: 25, page_num: 2, entry_title: '*'}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(provider_page_2_options, 'access_token').and_return(provider_collections_page_2_response)

      # mock for all collections associated to this service
      collection_associations_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/services/service_associated_collections.json'))))
      collection_associations_options = {page_size: 2000, page_num: 1, service_concept_id: @service_ingest_response['concept-id']}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(collection_associations_options, 'access_token').and_return(collection_associations_response)

      visit new_service_collection_association_path(@service_ingest_response['concept-id'])

    end
    # it 'lists the first page of collection associations' do
    #   within 'collection-associations' do
    #     expect(page).to have_selector('tbody tr', count: 25)
    #     # cmr controls the order so we should not test specific groups
    #   end
    # end

      # it 'take screenshot 1' do
      #   page.save_screenshot('/tmp/step1.png')
      # end

    # context 'when clicking button submit' do
    #   before do
    #     within '#collection-search' do
    #       select 'Entry Title', from: 'Search Field'
    #       find(:css, "input[id$='query_text']").set('*')
    #       click_button 'Submit'
    #     end
    #   end
    #   it 'displays the pagination information for page 1' do
    #     expect(page).to have_content('Disabled rows')
    #     page.save_screenshot('/tmp/step2.png')
    #   end
    # end

    # context 'when clicking to the second page' do
    #   before do
    #     click_link '2'
    #   end
    #   #
    #   #   it 'lists the second page of collection associations' do
    #   #     within 'collection-associations' do
    #   #       expect(page).to have_selector('tbody tr', count: 1)
    #   #       # cmr controls the order so we should not test specific groups
    #   #     end
    #   #   end
    #   #
    #   it 'displays the pagination information for page 2' do
    #     expect(page).to have_content('Disabled rows')
    #   end
    # end
  end
end