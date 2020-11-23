describe 'Descriptive keywords form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
    within '.metadata' do
      click_on 'Descriptive Keywords'
    end
  end

  context 'when checking the accordion headers for required icons' do
    it 'displays required icons on the Science Keywords accordion' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Science Keywords')
    end
  end

  context 'when submitting the form' do
    before do

      click_on 'Expand All'

      # Science keywords
      add_science_keywords
      add_science_keywords_suggestion

      # Ancillary Keywords
      within '.multiple.ancillary-keywords' do
        within '.multiple-item-0' do
          find('.ancillary-keyword').set 'Ancillary keyword 1'
          click_on 'Add another Ancillary Keyword'
        end
        within '.multiple-item-1' do
          find('.ancillary-keyword').set 'Ancillary keyword 2'
        end
      end

      # Additional Attributes
      within '.multiple.additional-attributes' do
        fill_in 'Name', with: 'Attribute 1'
        fill_in 'Description', with: 'Description'
        select 'Integer', from: 'Data Type'
        fill_in 'Description', with: 'Description'
        fill_in 'Measurement Resolution', with: 'Measurement Resolution'
        fill_in 'Parameter Range Begin', with: '1'
        fill_in 'Parameter Range End', with: '5'
        fill_in 'Parameter Units Of Measure', with: 'Parameter Units Of Measure'
        fill_in 'Parameter Value Accuracy', with: 'Parameter Value Accuracy'
        fill_in 'Value Accuracy Explanation', with: 'Value Accuracy Explanation'
        fill_in 'Group', with: 'Group'
        fill_in 'Update Date', with: '2015-09-14T00:00:00Z'

        click_on 'Add another Additional Attribute'

        within '.multiple-item-1' do
          fill_in 'Name', with: 'Attribute 2'
          fill_in 'Description', with: 'Description 2'
          select 'String', from: 'Data Type'
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      # Science keywords
      expect(page).to have_content 'EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE > SURFACE TEMPERATURE > MAXIMUM/MINIMUM TEMPERATURE > 24 HOUR MAXIMUM TEMPERATURE'
      expect(page).to have_content 'EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE'
      expect(page).to have_content 'EARTH SCIENCE > ATMOSPHERE > AEROSOLS > AEROSOL OPTICAL DEPTH/THICKNESS > ANGSTROM EXPONENT'

      # Ancillary Keywords
      within '.multiple.ancillary-keywords' do
        expect(page).to have_selector('input.ancillary-keyword[value="Ancillary keyword 1"]')
        expect(page).to have_selector('input.ancillary-keyword[value="Ancillary keyword 2"]')
      end

      # Additional Attributes
      within '.multiple.additional-attributes' do
        within '.multiple-item-0' do
          expect(page).to have_field('Name', with: 'Attribute 1')
          expect(page).to have_field('Description', with: 'Description')
          expect(page).to have_field('Data Type', with: 'INT')
          expect(page).to have_field('Description', with: 'Description')
          expect(page).to have_field('Measurement Resolution', with: 'Measurement Resolution')
          expect(page).to have_field('Parameter Range Begin', with: '1')
          expect(page).to have_field('Parameter Range End', with: '5')
          expect(page).to have_field('Parameter Units Of Measure', with: 'Parameter Units Of Measure')
          expect(page).to have_field('Parameter Value Accuracy', with: 'Parameter Value Accuracy')
          expect(page).to have_field('Value Accuracy Explanation', with: 'Value Accuracy Explanation')
          expect(page).to have_field('Group', with: 'Group')
          expect(page).to have_field('Update Date', with: '2015-09-14T00:00:00Z')
        end

        within '.multiple-item-1' do
          expect(page).to have_field('Name', with: 'Attribute 2')
          expect(page).to have_field('Data Type', with: 'STRING')
        end
      end
    end
  end
end
