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
      within '.metadata' do
        click_on 'Metadata Information'
      end

      open_accordions

      select 'English', from: 'Metadata Language'

      add_dates

      within '#directory-names' do
        fill_in 'Short Name', with: 'Short Directory 1'
        fill_in 'Long Name', with: 'Long Directory 1'
        click_on 'Add another Directory Name'
        within '.multiple-item-1' do
          fill_in 'Short Name', with: 'Short Directory 2'
          fill_in 'Long Name', with: 'Long Directory 2'
        end
      end

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

      # Directory Names
      expect(page).to have_content('Short Directory 1')
      expect(page).to have_content('Long Directory 1')
      expect(page).to have_content('Short Directory 2')
      expect(page).to have_content('Long Directory 2')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Metadata Information'
        end

        open_accordions
      end

      it 'populates the form with the values' do
        expect(page).to have_field('Metadata Language', with: 'eng')

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

        within '#directory-names' do
          expect(page).to have_field('Short Name', with: 'Short Directory 1')
          expect(page).to have_field('Long Name', with: 'Long Directory 1')

          within '.multiple-item-1' do
            expect(page).to have_field('Short Name', with: 'Short Directory 2')
            expect(page).to have_field('Long Name', with: 'Long Directory 2')
          end
        end
      end
    end
  end
end
