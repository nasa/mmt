#MMT-53

require 'rails_helper'

describe 'Data identification form' do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      click_on 'Data Identification'

      # Entry Id
      within '.entry-id-fields' do
        fill_in 'ID', with: '12345'
        fill_in 'Version', with: '1'
        fill_in 'Authority', with: 'Authority'
      end

      fill_in 'Entry Title', with: 'Draft Title'
      fill_in 'Abstract', with: 'This is a long description of the collection'
      fill_in 'Purpose', with: 'This is the purpose field'

      # Organization
      within '.organization-fields' do
        select 'User', from: 'Role'
        fill_in 'Short Name', with: 'short_name'
        fill_in 'Long Name', with: 'Long name'
      end

      # Processing Level
      within '.processing-level-fields' do
        fill_in 'ID', with: 'Level 1'
        fill_in 'Description', with: 'Level 1 Description'
      end

      select 'In work', from: 'Collection Progress'
      fill_in 'Quality', with: 'Metadata quality summary'
      fill_in 'Use Constraints', with: 'These are some use constraints'

      within '.nav-top' do
        click_on 'Save & Done'
      end
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('Draft Title')
    end

    it 'shows the values in the draft preview page' do
      expect(page).to have_content('12345')
      expect(page).to have_content('1')
      expect(page).to have_content('Authority')
    end

    context 'when returning to the form' do
      before do
        click_on 'Data Identification'
      end

      it 'populates the form with the values' do
        within '.entry-id-fields' do
          expect(page).to have_field('ID', with: '12345')
          expect(page).to have_field('Version', with: '1')
          expect(page).to have_field('Authority', with: 'Authority')
        end

        expect(page).to have_field('Entry Title', with: 'Draft Title')
        expect(page).to have_field('Abstract', with: 'This is a long description of the collection')
        expect(page).to have_field('Purpose', with: 'This is the purpose field')

        within '.organization-values' do
          expect(page).to have_content('Role: USER')
          expect(page).to have_content('ShortName: short_name')
          expect(page).to have_content('LongName: Long name')
        end
        within '.processing-level-fields' do
          expect(page).to have_field('ID', with: 'Level 1')
          expect(page).to have_field('Description', with: 'Level 1 Description')
        end
        expect(page).to have_field('Collection Progress', with: 'IN WORK')
        expect(page).to have_field('Quality', with: 'Metadata quality summary')
        expect(page).to have_field('Use Constraints', with: 'These are some use constraints')
      end
    end
  end
end
