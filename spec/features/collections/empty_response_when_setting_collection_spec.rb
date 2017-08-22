require 'rails_helper'

describe 'Viewing a collection', js: true do
  # this test is for the unusual case when retrieving the concept works but the
  # search endpoints used to retrieve revisions and granule counts returns an
  # empty response. this has not happened for collections, but a similar issue
  # occurred with variables when the CMR elasticsearch indexer was not functioning properly

  let(:short_name) { 'MIRCCMF' }
  concept_id = 'C1200000044-LARC'

  before do
    login
  end

  context 'when the endpoints all work properly' do
    context 'when viewing a collection with granules and revisions' do
      before do
        visit collection_path(concept_id)
      end

      it 'displays the collection show page with expected data' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collections')
          expect(page).to have_content(short_name)
        end

        expect(page).to have_content('Revisions (2)')
        expect(page).to have_content('Granules (1)')
      end
    end
  end

  context 'when the concepts endpoint works properly but the search endpoints do not' do
    context 'when the search endpoint used to retrieve granule count is successful but empty' do
      let(:empty_granule_count_response) do
        {
          "feed": {
            "updated": '2017-08-21T15:17:57.565Z',
            "id": 'http://localhost:3003/collections.json?concept_id=C1200000015-SEDAC&include_granule_counts=true&pretty=true',
            "title": 'ECHO dataset metadata',
            "entry": []
          }
        }.to_json
      end

      before do
        granule_response = cmr_success_response(empty_granule_count_response)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_granule_count).and_return(granule_response)

        visit collection_path(concept_id)
      end

      it 'displays the collection show page' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collections')
          expect(page).to have_content(short_name)
        end

        expect(page).to have_content('Revisions (2)')
      end

      it 'does not show any granules' do
        expect(page).to have_content('Granules (0)')
      end
    end

    context 'when the search endpoint used to retrieve revisions is successful but empty' do
      let(:empty_revisions_search_response) do
        {
          'hits': 0,
          'took': 5,
          'items': []
        }.to_json
      end

      before do
        revisions_response = cmr_success_response(empty_revisions_search_response)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(revisions_response)

        visit collection_path(concept_id)
      end

      it 'displays the appropriate error message and blank page' do
        expect(page).to have_css('.eui-banner--info', text: 'This collection is not available. It is either being published right now, does not exist, or you have insufficient permissions to view this collection.')

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collections')
          expect(page).to have_no_content(short_name)
          expect(page).to have_content('Blank Short Name')
        end

        expect(page).to have_no_content('Revisions (2)')
        expect(page).to have_no_content('Granules (1)')
      end
    end
  end
end
