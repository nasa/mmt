# MMT-1775
describe 'Archive And Distribution Information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Archive And Distribution Information'
      end

      click_on 'Expand All'

      add_archive_and_distribution_information

      click_on 'Collapse All'
      click_on 'Expand All'
    end

    it 'populates the form with the values' do
      within '.multiple.file-archive-informations' do
        within first('.multiple-item-0') do
          expect(page).to have_field('Format', with: 'jpeg')
          expect(page).to have_field('Format Type', with: 'Native')
          expect(page).to have_field('Average File Size', with: '2')
          expect(page).to have_field('Average File Size Unit', with: 'MB')
          expect(page).to have_field('Total Collection File Size', with: '15')
          expect(page).to have_field('Total Collection File Size Unit', with: 'GB')
          expect(page).to have_field('Description', with: 'A file archive information description')
        end
        within first('.multiple-item-1') do
          expect(page).to have_field('Format', with: 'kml')
          expect(page).to have_field('Format Type', with: 'Native')
        end
      end

      within '.multiple.file-distribution-informations' do
        within first('.multiple-item-0') do
          expect(page).to have_field('Format', with: 'binary')
          expect(page).to have_field('Format Type', with: 'Supported')
          expect(page).to have_field('Average File Size', with: '1')
          expect(page).to have_field('Average File Size Unit', with: 'MB')
          expect(page).to have_field('Description', with: 'A file distribution information description')
          expect(page).to have_field('Fees', with: 'File archive information fees')
        end
      end
    end
  end
end