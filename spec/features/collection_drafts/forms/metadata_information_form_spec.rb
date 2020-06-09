# MMT-288 MMT-295

describe 'Metadata Information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Metadata Information'
      end

      click_on 'Expand All'

      select 'English', from: 'Metadata Language'

      add_metadata_dates

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    # Christian's example; verifying successful removal of Directory Names fields
    it "should not contain Directory Names section" do
      expect(page).to have_no_css('#directory-names')
      expect(page).to have_no_content('Directory Names')
      expect(page).to have_no_field('Short Name')
      expect(page).to have_no_field('Long Name')
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
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
    end
  end
end
