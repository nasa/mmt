# MMT-381

require 'rails_helper'

describe 'Collection Information form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Collection Information'
      end

      fill_in 'Short Name', with: '12345'
      fill_in 'Version', with: 'v2'
      fill_in 'Entry Title', with: 'Draft Title'
      fill_in 'Abstract', with: 'This is a long description of the collection'
      fill_in 'Purpose', with: 'This is the purpose field'
      select 'English', from: 'Data Language'

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('Draft Title')
    end

    it 'shows pre-entered values in the draft preview page' do
      within '.preview' do
        expect(page).to have_content('12345', count: 1)
        expect(page).to have_content('v2', count: 1)
        expect(page).to have_content('Draft Title', count: 1)
        expect(page).to have_content('This is a long description of the collection', count: 1)
        expect(page).to have_content('This is the purpose field', count: 1)
      end

      expect(page).to have_content('No Temporal Coverages found')
      expect(page).to have_content('No Spatial Coordinates found')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end
      end

      it 'populates the form with the values' do
        expect(page).to have_field('Short Name', with: '12345')
        expect(page).to have_field('Version', with: 'v2')
        expect(page).to have_field('Entry Title', with: 'Draft Title')
        expect(page).to have_field('Abstract', with: 'This is a long description of the collection')
        expect(page).to have_field('Purpose', with: 'This is the purpose field')
        expect(page).to have_field('Data Language', with: 'eng')
      end
    end
  end
end
