# MMT-81, MMT-82, MMT-83

require 'rails_helper'

describe 'Delete collection', js: true do
  before do
    login
  end

  context 'when viewing a published collection' do
    before do
      ingest_response, concept_response = publish_draft

      visit collection_path(ingest_response['concept-id'])
    end

    context 'when the collection has no granules' do
      it 'displays a delete link' do
        expect(page).to have_content('Delete Record')
      end

      context 'when clicking the delete link' do
        before do
          click_on 'Delete Record'

          within '#delete-record-modal' do
            click_on 'Yes'
          end
        end

        it 'displays a confirmation message' do
          expect(page).to have_content('Collection was successfully deleted')
        end

        it 'displays the revision page' do
          expect(page).to have_content('Revision History')
        end

        it 'displays the correct number of revisions' do
          expect(page).to have_selector('tbody > tr', count: 2)
        end

        it 'displays the latest revision as being deleted' do
          within first('tbody > tr') do
            expect(page).to have_content('Deleted')
          end
        end

        it 'displays the correct phrasing for reverting records' do
          expect(page).to have_content('Reinstate', count: 1)
        end
      end
    end
  end

  context 'when viewing a published collection with granules' do
    before do
      # Set the users provider to be LARC, in order to see collection with granules
      user = User.first
      user.provider_id = 'LARC'
      user.save

      short_name = 'ACR3L2DM'

      fill_in 'Quick Find', with: short_name
      click_on 'Find'

      click_on short_name
    end

    it 'displays the number of granules' do
      expect(page).to have_content('Granules (1)')
    end

    context 'when clicking the delete link' do
      before do
        click_on 'Delete Record'
      end

      it 'does not allow the user to delete the collection' do
        expect(page).to have_content('Collections with granules cannot be deleted')
      end
    end
  end

  context 'when viewing a published collection with a non url encoded native id' do
    before do
      ingest_response, _concept_response = publish_draft(native_id: 'not & url, encoded / native id')

      visit collection_path(ingest_response['concept-id'])
    end

    context 'when clicking the delete link' do
      before do
        click_on 'Delete Record'

        within '#delete-record-modal' do
          click_on 'Yes'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection was successfully deleted')
      end
    end
  end
end
