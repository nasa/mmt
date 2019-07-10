describe 'Reverting to previous collections', js: true do
  before do
    login
  end

  context 'when the latest revision is a published collection' do
    before do
      ingest_response, @concept_response = publish_collection_draft(revision_count: 2)

      visit collection_path(ingest_response['concept-id'])

      within '.action' do
        click_on 'Revisions'
      end
    end

    it 'displays the correct phrasing for reverting records' do
      expect(page).to have_content('Revert to this Revision', count: 1)
    end

    context 'when reverting the collection' do
      before do
        click_on 'Revert to this Revision'
        click_on 'Yes'

        wait_for_jQuery
        wait_for_cmr
      end

      it 'displays all the correct revision information' do
        expect(page).to have_content('Revision Created Successfully!')

        expect(page).to have_content('Published', count: 1)
        expect(page).to have_content('Revision View', count: 2)
        expect(page).to have_content('Revert to this Revision', count: 2)
      end
    end

    context 'when reverting the collection fails ingestion into CMR' do
      before do
        # Do something to the revision so it fails
        # Add a new field to the metadata, similar to a field name changing
        # and old metadata still having the old field name
        new_concept = @concept_response.deep_dup
        new_concept.body['BadField'] = 'Not going to work'

        allow_any_instance_of(Cmr::CmrClient).to receive(:get_concept).and_return(new_concept)

        click_on 'Revert to this Revision'
        click_on 'Yes'

        wait_for_jQuery
        wait_for_cmr
      end

      it 'displays an error message' do
        expect(page).to have_content('extraneous key [BadField] is not permitted')
      end
    end
  end

  context 'when the latest revision is a deleted collection' do
    before do
      ingest_response, concept_response = publish_collection_draft

      visit collection_path(ingest_response['concept-id'])

      click_on 'Delete Collection Record'
      click_on 'Yes'

      wait_for_jQuery
      wait_for_cmr
    end

    it 'displays the correct phrasing for reverting records' do
      expect(page).to have_content('Reinstate', count: 1)
    end

    context 'when reverting the collection' do
      before do
        click_on 'Reinstate'
        click_on 'Yes'

        wait_for_jQuery
        wait_for_cmr
      end

      it 'displays all the correct revision information' do
        expect(page).to have_content('Revision Created Successfully!')

        expect(page).to have_content('Published', count: 1)
        expect(page).to have_content('Deleted', count: 1)
        expect(page).to have_content('Revision View', count: 1)
        expect(page).to have_content('Revert to this Revision', count: 1)
      end
    end
  end

  context 'when the revision is a format other than umm json' do
    let(:short_name) { 'MIRCCMF' }

    before do
      login(providers: %w(MMT_2 LARC))
      visit manage_collections_path

      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
      click_link short_name

      @collection_concept = current_path.sub('/collections/', '')

      within '.action' do
        click_on 'Revisions'
      end
    end

    context 'when reverting the collection' do
      it 'displays a success message' do
        click_on 'Revert to this Revision', match: :first
        find('.not-current-provider-link').click

        wait_for_jQuery
        wait_for_cmr

        expect(page).to have_content('Revision Created Successfully!')
      end

      it 'the collection metadata format being ingested is echo10' do
        expected_content_type = 'application/echo10+xml; charset=utf-8'

        revert_success = "{\"concept-id\":\"#{@collection_concept}\", \"revision-id\":3}"
        revert_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(revert_success)))

        expect_any_instance_of(Cmr::CmrClient).to receive(:ingest_collection).with(kind_of(String), 'LARC', anything, anything, expected_content_type).and_return(revert_response)

        click_on 'Revert to this Revision', match: :first
        find('.not-current-provider-link').click

        wait_for_jQuery
      end
    end
  end
end
