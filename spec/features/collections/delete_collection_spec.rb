# MMT-81, MMT-82, MMT-83

require 'rails_helper'

describe 'Delete collection', js: true, reset_provider: true do
  before do
    login
  end

  context 'when viewing a published collection' do
    before do
      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)

      click_on 'Publish'
    end

    context 'when the collection has no granules' do
      it 'displays a delete link' do
        expect(page).to have_content('Delete Record')
      end

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
  end

  context 'when viewing a published collection with granules' do
    before do
      entry_id = 'doi:10.3334/ORNLDAAC/1_1'

      fill_in 'entry_id', with: entry_id
      click_on 'Find'

      click_on entry_id
    end

    it 'displays the number of granules' do
      expect(page).to have_content('Granules (1)')
    end

    context 'when clicking the delete link' do
      before do
        accept_alert_from do
          click_on 'Delete Record'
        end
      end

      it 'does not allow the user to delete the collection' do
        expect(page).to have_content('PUBLISHED RECORD')
        expect(page).to have_content('Granules (1)')
      end
    end
  end
end
