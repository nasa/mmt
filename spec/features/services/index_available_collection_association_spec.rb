require 'rails_helper'

describe 'Show Existing Service Collection Associations', js: true, reset_provider: true do
  before do
    login(provider: 'MMT_2', providers: %w[MMT_1 MMT_2 LARC])
  end

  context 'when there are paginated collection associations' do
    before do
      # publish a service
      @provider_id = 'LARC'
      @native_id = Faker::Crypto.md5
      @service_ingest_response, _concept_response = publish_service_draft(provider_id: @provider_id, native_id: @native_id)
      @service_concept_id = @service_ingest_response['concept-id']

      # gets all provider collections
      @provider_collections = get_collections_by_provider(@provider_id)
      #puts 'provider collections: ' + @provider_collections.to_s
      # gets number of collections to be assigned to the service
      if @provider_collections.length >= 27
        @service_collections = @provider_collections[0..25]
      else
        @service_collections = @provider_collections
      end
      #puts 'service collections: ' + @service_collections.to_s

      cmr_client.add_collection_assocations_to_service(@service_concept_id, @service_collections, 'access_token')

      visit manage_services_path
      click_on 'profile-link'
      click_on 'Change Provider'
      select 'LARC', from: 'select_provider'

      wait_for_cmr

      visit new_service_collection_association_path(@service_concept_id)
    end

    after do
      cleanup_service_and_collection_associations(@provider_id, @service_concept_id, @native_id, @service_collections)
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