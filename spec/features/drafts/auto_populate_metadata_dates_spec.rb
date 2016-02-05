# MMT-378

require 'rails_helper'

describe 'Auto populating metadata dates', js: true do
  context 'when publishing a new collection' do
    before do
      login
      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)

      # Remove Metadata Dates
      metadata = draft.draft
      metadata.delete('MetadataDates')
      draft.draft = metadata
      draft.save

      visit draft_path(draft)
      click_on 'Publish'
      open_accordions
    end

    it 'displays the create date on the collection page' do
      within '.preview .metadata-dates .metadata-dates-0' do
        expect(page).to have_content("Type: Creation Date: #{today_string}")
      end
    end

    context 'when publishing an update to the collection' do
      before do
        click_on 'Edit Record'
        click_on 'Publish'
        open_accordions
      end

      it 'displays the update date on the collection page' do
        within '.preview .metadata-dates .metadata-dates-0' do
          expect(page).to have_content("Type: Creation Date: #{today_string}")
        end
        within '.preview .metadata-dates .metadata-dates-1' do
          expect(page).to have_content("Type: Last Revision Date: #{today_string}")
        end
      end
    end
  end
end
