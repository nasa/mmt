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
      collection_association_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/services/service_associated_collections.json'))))
      all_pages_options = { service_concept_id: @service_ingest_response['concept-id']}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(all_pages_options, 'access_token').and_return(collection_association_response)

      # mock for collection association list page 1
      collection_association_page_1_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/services/service_associated_collections_page_1.json'))))
      page_1_options = { page_size: 25, page_num: 1, service_concept_id: @service_ingest_response['concept-id']}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(page_1_options, 'access_token').and_return(collection_association_page_1_response)

      # mock for collection association list page 2
      collection_association_page_2_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/services/service_associated_collections_page_2.json'))))
      page_2_options = { page_size: 25, page_num: '2', service_concept_id: @service_ingest_response['concept-id']}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).with(page_2_options, 'access_token').and_return(collection_association_page_2_response)

      visit service_collection_associations_path(@service_ingest_response['concept-id'])
    end
    # it 'lists the first page of collection associations' do
    #   within 'collection-associations' do
    #     expect(page).to have_selector('tbody tr', count: 25)
    #     # cmr controls the order so we should not test specific groups
    #   end
    # end
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
      #
      #   it 'lists the second page of collection associations' do
      #     within 'collection-associations' do
      #       expect(page).to have_selector('tbody tr', count: 1)
      #       # cmr controls the order so we should not test specific groups
      #     end
      #   end
      #
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