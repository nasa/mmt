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

      visit service_collection_associations_path(@service_concept_id)
    end

    after do
      cleanup_service_and_collection_associations(@provider_id, @service_concept_id, @native_id, @service_collections)
    end

    it 'lists the first page of collection associations' do
      within '#collection-associations' do
        expect(page).to have_selector('tbody tr', count: 25)
      end
    end

    it 'displays the pagination information for page 1' do
      expect(page).to have_content('Showing Collection Associations 1 - 25 of 26')
      within '.eui-pagination' do
        # first, 1, 2, next, last
        expect(page).to have_selector('li', count: 5)
      end
      expect(page).to have_css('.active-page', text: '1')
    end

    context 'when clicking to the second page' do
      before do
        click_link '2'
      end

      it 'lists the second page of collection associations' do
        within '#collection-associations' do
          expect(page).to have_selector('tbody tr', count: 1)
        end
      end

      it 'displays the pagination information for page 2' do
        expect(page).to have_content('Showing Collection Associations 26 - 26 of 26')
        within '.eui-pagination' do
          # first, previous, 1, 2, last
          expect(page).to have_selector('li', count: 5)
        end
        expect(page).to have_css('.active-page', text: '2')
      end
    end

  end

end