# MMT-87, MMT-88, MMT-21

require 'rails_helper'

describe 'Revision list', js: true, reset_provider: true do
  context 'when viewing a published collection' do
    before do
      login

      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)

      # publish draft
      click_on 'Publish'

      # go back to the draft and publish it a second time
      visit draft_path(draft)
      click_on 'Publish'
    end

    it 'displays the number of revisions' do
      expect(page).to have_content('Revisions (2)')
    end

    context 'when clicking on the revision link' do
      before do
        click_on 'Revisions'
      end

      it 'displays the revision page' do
        expect(page).to have_content('Revision History')
      end

      it 'displays the collection entry title' do
        expect(page).to have_content('Draft Title')
      end

      it 'displays when the revision was made' do
        expect(page).to have_content('mock-admin', count: 2)
      end

      it 'displays what user made the revision' do
        expect(page).to have_content(today_string, count: 2)
      end

      it 'displays the correct phrasing for reverting records' do
        expect(page).to have_content('Revert to this Revision', count: 1)
      end

      context 'when viewing an old revision' do
        before do
          all('a', text: 'View').last.click
        end

        it 'displays a message that the revision is old' do
          expect(page).to have_link('You are viewing an older revision of this collection. Click here to view the latest published version.')
        end
      end
    end

    context 'when searching for the collection' do
      before do
        click_on 'Full Metadata Record Search'
        select 'MMT_2', from: 'provider_id'
        select 'Entry ID', from: 'search_term_type'
        fill_in 'search_term', with: '12345'
        click_on 'Submit'
      end

      it 'only displays the latest revision' do
        within '#collection_search_results' do
          expect(page).to have_content('12345', count: 1)
        end
      end
    end
  end
end
