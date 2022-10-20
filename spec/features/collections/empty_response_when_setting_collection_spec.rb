# EDL Failed Test
describe 'Viewing a collection', js: true, skip: true do
  # this test is for the unusual case when retrieving the concept works but the
  # search endpoints used to retrieve revisions and granule counts returns an
  # empty response. this has not happened for collections, but a similar issue
  # occurred with variables when the CMR elasticsearch indexer was not functioning properly

  let(:short_name_with_granules)  { 'MIRCCMF' }
  let(:entry_title_with_granules) { 'MISR FIRSTLOOK radiometric camera-by-camera Cloud Mask V001' }
  let(:concept_id_with_granules) { collection_concept_from_keyword('MIRCCMF') }

  before :all do
    @ingest_response, @concept_response = publish_collection_draft(revision_count: 3)
  end

  before do
    login
  end

  context 'when the endpoints all work properly' do
    context 'when viewing a collection with revisions' do
      before do
        visit collection_path(@ingest_response['concept-id'])
      end

      it 'displays the collection show page with correct revision count' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collections')
          expect(page).to have_content(@concept_response.body['ShortName'])
        end

        expect(page).to have_content('Revisions (3)')
      end
    end

    context 'when viewing a collection with granules' do
      before do
        visit collection_path(concept_id_with_granules)
      end

      it 'displays the collection show page with correct granule count' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collections')
          expect(page).to have_content(short_name_with_granules)
        end

        expect(page).to have_content('Granules (1)')
      end
    end
  end

  context 'when the concepts endpoint works properly but the search endpoints do not' do
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
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(revisions_response)

        visit collection_path(@ingest_response['concept-id'])
      end

      it 'displays the appropriate error message and blank page' do
        expect(page).to have_css('.eui-banner--info', text: 'This collection is not available. It is either being published right now, does not exist, or you have insufficient permissions to view this collection.')

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collections')
          expect(page).to have_no_content(@concept_response.body['ShortName'])
          expect(page).to have_content('Blank Short Name')
        end

        expect(page).to have_no_content('Revisions (3)')
        expect(page).to have_no_content('Granules')
      end
    end
  end
end
