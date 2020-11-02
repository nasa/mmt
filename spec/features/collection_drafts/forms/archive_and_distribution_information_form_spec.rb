describe 'Archive And Distribution Information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
    within '.metadata' do
      click_on 'Archive And Distribution Information'
    end
  end

  context 'when checking the accordion headers for required icons' do
    it 'does not display required icons for accordions in Archive And Distribution Information section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end
  end

  context 'When viewing the form with stored values' do
    before do
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
          expect(page).to have_field('Format Description', with: 'A format description')
          expect(page).to have_field('Average File Size', with: '2')
          expect(page).to have_field('Average File Size Unit', with: 'MB')
          expect(page).to have_field('Total Collection File Size', with: '15')
          expect(page).to have_field('Total Collection File Size Unit', with: 'GB')
          expect(page).to have_field('Description', with: 'A file archive information description')
        end
        within first('.multiple-item-1') do
          expect(page).to have_field('Format', with: 'kml')
          expect(page).to have_field('Format Type', with: 'Native')
          expect(page).to have_field('Format Description', with: 'A format description')
          expect(page).to have_field('Average File Size', with: '10')
          expect(page).to have_field('Average File Size Unit', with: 'MB')
          expect(page).to have_field('Total Collection File Size Begin Date', with: '2015-07-01T00:00:00Z')
        end
      end

      within '.multiple.file-distribution-informations' do
        within first('.multiple-item-0') do
          expect(page).to have_field('Format', with: 'binary')
          expect(page).to have_field('Format Type', with: 'Supported')
          expect(page).to have_field('Format Description', with: 'A format description')
          expect(page).to have_field('draft_archive_and_distribution_information_file_distribution_information_0_media_0', with: 'disc')
          expect(page).to have_field('draft_archive_and_distribution_information_file_distribution_information_0_media_1', with: 'file')
          expect(page).to have_field('Average File Size', with: '1')
          expect(page).to have_field('Average File Size Unit', with: 'MB')
          expect(page).to have_field('Description', with: 'A file distribution information description')
          expect(page).to have_field('Fees', with: 'File archive information fees')
        end
      end
    end
  end

  context 'When filling the form with valid values' do
    before do
      click_on 'Expand All'
      within '.multiple.file-archive-informations' do
        fill_in 'Format', with: 'jpeg'
        select 'Native', from: 'Format Type'
      end
      within '.nav-top' do
        click_on 'Save'
      end
    end
    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end
  end

  context 'When filling the form with invalid values' do
    before do
      click_on 'Expand All'
      within '.multiple.file-archive-informations' do
        fill_in 'Average File Size', with: 'abc'
        fill_in 'Total Collection File Size', with: 'def'
      end
      within '.nav-top' do
        click_on 'Save'
      end
    end
    it 'displays a confirmation message' do
      expect(page).to have_content('Average File Size must be of type number')
      expect(page).to have_content('Total Collection File Size must be of type number')
    end
  end

  context 'when filling the form without required field' do
    before do
      click_on 'Expand All'
      within '.multiple.file-archive-informations' do
        select 'Native', from: 'Format Type'
      end
      within '.nav-top' do
        click_on 'Done'
      end
    end
    it 'displays a confirmation message' do
      expect(page).to have_content('Format is required')
    end
  end

  context 'when filling the form without required field then go to progress page' do
    before do
      click_on 'Expand All'
      within '.multiple.file-archive-informations' do
        select 'Native', from: 'Format Type'
      end
      within '.nav-top' do
        click_on 'Done'
      end
      # Accept modal
      click_on 'Yes'
    end
    it 'fills in the correct circle in red' do
      within '#archive-and-distribution-information a[title="File Archive Information - Invalid"]' do
        expect(page).to have_css('.eui-fa-minus-circle.icon-red')
      end
    end
  end

  context 'When filling the form without dependent values' do
    before do
      click_on 'Expand All'
      within '.multiple.file-distribution-informations' do
        fill_in 'Average File Size', with: '15'
        fill_in 'Total Collection File Size', with: '15'
      end
      within '.nav-top' do
        click_on 'Save'
      end
    end
    it 'displays a confirmation message' do
      expect(page).to have_content('Average File Size Unit is required')
      expect(page).to have_content('Total Collection File Size Unit is required')
    end
  end
end
