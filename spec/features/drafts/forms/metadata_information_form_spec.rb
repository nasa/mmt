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

      add_metadata_dates

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
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Draft was successfully updated')
    end

    it 'populates the form with the values' do
      expect(page).to have_field('Metadata Language', with: 'eng')

      within '.multiple.dates' do
        within '.multiple-item-0' do
          expect(page).to have_field('Type', with: 'REVIEW')
          expect(page).to have_field('Date', with: '2015-07-01T00:00:00Z')
        end
        within '.multiple-item-1' do
          expect(page).to have_field('Type', with: 'DELETE')
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
