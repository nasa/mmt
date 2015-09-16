# MMT-288 MMT-295

require 'rails_helper'

describe 'Metadata Information form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      click_on 'Metadata Information'

      fill_in 'Metadata Language', with: 'English'

      add_dates

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it 'shows pre-entered values in the draft preview page' do
      expect(page).to have_content('English')

      # Metadata Dates
      # Date 1
      expect(page).to have_content('Create')
      expect(page).to have_content('2015-07-01T00:00:00Z')

      # Date 2
      expect(page).to have_content('Review')
      expect(page).to have_content('2015-07-02T00:00:00Z')

      expect(page).to have_content('No Temporal Coverages found')
      expect(page).to have_content('No Spatial Coordinates found')
    end

    context 'when returning to the form' do
      before do
        click_on 'Metadata Information'

        open_accordions
      end

      it 'populates the form with the values' do
        expect(page).to have_field('Metadata Language', with: 'English')

        within '.multiple.dates' do
          within '.multiple-item-0' do
            expect(page).to have_field('Type', with: 'CREATE')
            expect(page).to have_field('Date', with: '2015-07-01T00:00:00Z')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Type', with: 'REVIEW')
            expect(page).to have_field('Date', with: '2015-07-02T00:00:00Z')
          end
        end
      end
    end
  end
end
