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

    it 'populates the metadata create date' do
      dates = Draft.first.draft['MetadataDates'].count { |date| date['Type'] == 'CREATE' }
      expect(dates).to eq(1)
    end

    it 'displays the create date on the collection page' do
      within '.preview .metadata-dates .metadata-dates-0' do
        expect(page).to have_content("Type: Creation Date: #{today_string}")
      end
    end

    context 'when publishing an update to the collection' do
      before do
        draft = Draft.first

        click_on 'Edit Record'
        within '.metadata' do
          click_on 'Metadata Information'
        end
        open_accordions

        add_metadata_dates

        within '.nav-top' do
          click_on 'Save & Done'
        end

        click_on 'Publish'
        open_accordions
      end

      it 'populates the metadata update date' do
        dates = Draft.first.draft['MetadataDates'].count { |date| date['Type'] == 'UPDATE' }
        expect(dates).to eq(1)
      end

      it 'displays the update date, new metadata dates, and creation date on the collection page' do
        within '.preview .metadata-information-preview' do
          expect(page).to have_content("Type: Creation Date: #{today_string}")
          expect(page).to have_content("Type: Last Revision Date: #{today_string}")

          expect(page).to have_content('Future Review')
          expect(page).to have_content('2015-07-01T00:00:00Z')

          expect(page).to have_content('Planned Deletion')
          expect(page).to have_content('2015-07-02T00:00:00Z')
        end
      end
    end
  end
end
