# MMT-81

require 'rails_helper'

describe 'Delete collection', js: true, reset_provider: true do
  context 'when viewing a published collection' do
    before do
      login

      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)

      click_on 'Publish'
    end

    context 'when the collection has no granules' do
      context 'when clicking the delete link' do
        before do
          accept_confirm_from do
            click_on 'Delete Record'
          end
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

    context 'when the collection has granules' do
      # TODO MMT-83
      it 'does not allow the user to delete the collection'
    end
  end
end
