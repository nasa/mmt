require 'rails_helper'

describe 'Reverting to previous variables', js: true do
  before do
    login
  end

  context 'when the latest revision is a published variable' do
    before do
      ingest_response, @concept_response = publish_variable_draft(revision_count: 2)

      visit variable_path(ingest_response['concept-id'])

      click_on 'Revisions'
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
        expect(page).to have_content('Revision Created Successfully!')

        expect(page).to have_content('Published', count: 1)
        expect(page).to have_content('Revision View', count: 2)
        expect(page).to have_content('Revert to this Revision', count: 2)
      end
    end

    context 'when reverting the variable fails ingestion into CMR' do
      before do
        # Do something to the revision so it fails
        # Add a new field to the metadata, similar to a field name changing
        # and old metadata still having the old field name
        new_concept = @concept_response.deep_dup
        new_concept.body['BadField'] = 'Not going to work'

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

  context 'when the latest revision is a deleted variable' do
    before do
      ingest_response, _concept_response = publish_variable_draft

      visit variable_path(ingest_response['concept-id'])

      click_on 'Delete Variable Record'
      click_on 'Yes'

      wait_for_ajax
      wait_for_cmr
    end

    it 'displays the correct phrasing for reverting records' do
      expect(page).to have_content('Reinstate', count: 1)
    end

    context 'when reverting the variable' do
      before do
        click_on 'Reinstate'
        click_on 'Yes'

        wait_for_ajax
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
end
