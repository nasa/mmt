# MMT-89 MMT-90

require 'rails_helper'

describe 'Reverting to previous collections', js: true do
  before do
    login
  end

  context 'when the latest revision is a published collection' do
    before do
      ingest_response, @concept_response = publish_draft(revision_count: 2)

      visit collection_path(ingest_response['concept-id'])

      within '.cta' do
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

        wait_for_ajax
        wait_for_cmr
      end

      it 'displays all the correct revision information' do
        expect(page).to have_content('Revision was successfully created')

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
        # new_metadata = build(:full_draft).draft
        # new_metadata['BadField'] = 'Not going to work'
        new_concept = @concept_response.deep_dup
        new_concept.body['BadField'] = 'Not going to work'

        # allow_any_instance_of(Cmr::CmrClient).to receive(:get_concept).and_return(new_metadata)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_concept).and_return(new_concept)

        click_on 'Revert to this Revision'
        click_on 'Yes'

        wait_for_ajax
        wait_for_cmr
      end

      it 'displays an error message' do
        expect(page).to have_content('object instance has properties which are not allowed by the schema: ["BadField"]')
      end
    end
  end

  context 'when the latest revision is a deleted collection' do
    before do
      ingest_response, concept_response = publish_draft

      visit collection_path(ingest_response['concept-id'])

      click_on 'Delete Record'
      click_on 'Yes'

      wait_for_ajax
      wait_for_cmr
    end

    it 'displays the correct phrasing for reverting records' do
      expect(page).to have_content('Reinstate', count: 1)
    end

    context 'when reverting the collection' do
      before do
        click_on 'Reinstate'
        click_on 'Yes'

        wait_for_ajax
        wait_for_cmr
      end

      it 'displays all the correct revision information' do
        expect(page).to have_content('Revision was successfully created')

        expect(page).to have_content('Published', count: 1)
        expect(page).to have_content('Deleted', count: 1)
        expect(page).to have_content('Revision View', count: 1)
        expect(page).to have_content('Revert to this Revision', count: 1)
      end
    end
  end
end
