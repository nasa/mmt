require 'rails_helper'

describe 'Delete collection', js: true do
  before :all do
    @ingest_response, _concept_response = publish_collection_draft

    @ingested_collection_for_delete_messages, _concept_response = publish_collection_draft
  end

  before do
    login
  end

  context 'when viewing a published collection' do
    before do
      visit collection_path(@ingest_response['concept-id'])
    end

    context 'when the collection has no granules' do
      it 'displays a delete link' do
        expect(page).to have_content('Delete Collection Record')
      end

      context 'when clicking the delete link' do
        before do
          click_on 'Delete Collection Record'

          within '#delete-record-modal' do
            click_on 'Yes'
          end
        end

        it 'redirects to the revisions page and displays a confirmation message' do
          expect(page).to have_content('Collection Deleted Successfully!')

          expect(page).to have_content('Revision History')
          expect(page).to have_selector('tbody > tr', count: 2)

          within first('tbody > tr') do
            expect(page).to have_content('Deleted')
          end

          expect(page).to have_content('Reinstate', count: 1)
        end
      end
    end
  end

  context 'when viewing a published collection with granules' do
    let(:short_name) { 'MIRCCMF' }
    before do
      # Set the users provider to be LARC, in order to see collection with granules
      login(provider: 'LARC', providers: %w[MMT_2 LARC])
      visit manage_collections_path

      fill_in 'keyword', with: short_name
      click_on 'Search Collections'

      click_on short_name
    end

    it 'displays the number of granules' do
      expect(page).to have_content('Granules (1)')
    end

    context 'when clicking the delete link' do
      before do
        click_on 'Delete Collection Record'
      end

      it 'does not allow the user to delete the collection' do
        expect(page).to have_content('This collection cannot be deleted using the MMT because it has associated granules.  Use the CMR API to delete the collection and its granules.')
      end
    end
  end

  context 'when switching provider context while deleting' do
    let(:short_name) { 'MIRCCMF' }
    before do
      # Set the user's provider to be MMT_2
      login(provider: 'MMT_2', providers: %w[MMT_2 LARC])
      visit manage_collections_path

      fill_in 'keyword', with: short_name
      click_on 'Search Collections'

      click_on short_name
    end

    context 'when clicking the delete link' do
      before do
        click_on 'Delete Collection Record'
      end

      it 'does not allow the user to delete the collection' do
        expect(page).to have_content('This collection cannot be deleted using the MMT because it has associated granules.  Use the CMR API to delete the collection and its granules.')
      end
    end
  end

  context 'when viewing a published collection with a non url encoded native id' do
    before do
      ingest_response, _concept_response = publish_collection_draft(native_id: 'not & url, encoded / native id')

      visit collection_path(ingest_response['concept-id'])
    end

    context 'when clicking the delete link' do
      before do
        click_on 'Delete Collection Record'

        within '#delete-record-modal' do
          click_on 'Yes'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Deleted Successfully!')
      end
    end
  end

  context 'when deleting the collection will fail' do
    before do
      visit collection_path(@ingested_collection_for_delete_messages['concept-id'])
    end

    context 'when CMR provides a message' do
      before do
        error_body = '{"errors": ["You do not have permission to perform that action."]}'
        error_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse(error_body), response_headers: {}))
        allow_any_instance_of(Cmr::CmrClient).to receive(:delete_collection).and_return(error_response)

        click_on 'Delete Collection Record'

        within '#delete-record-modal' do
          click_on 'Yes'
        end
      end

      it 'displays the CMR error message' do
        expect(page).to have_css('.eui-banner--danger', text: 'You do not have permission to perform that action.')
      end
    end

    context 'when CMR does not provide a message' do
      before do
        error_body = '{"message": "useless message"}'
        error_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse(error_body), response_headers: {}))
        allow_any_instance_of(Cmr::CmrClient).to receive(:delete_collection).and_return(error_response)

        click_on 'Delete Collection Record'

        within '#delete-record-modal' do
          click_on 'Yes'
        end
      end

      it 'displays the CMR error message' do
        expect(page).to have_css('.eui-banner--danger', text: 'Collection was not deleted successfully')
      end
    end
  end
end
