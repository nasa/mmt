require 'rails_helper'

describe 'Science and Ancillary Keywords Form', reset_provider: true, js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'science_and_ancillary_keywords')
    click_on 'Expand All'
  end

  context 'when submitting the form' do
    before do
      choose_keyword 'EARTH SCIENCE'
      choose_keyword 'ATMOSPHERE'
      choose_keyword 'ATMOSPHERIC TEMPERATURE'
      choose_keyword 'SURFACE TEMPERATURE'
      choose_keyword 'MAXIMUM/MINIMUM TEMPERATURE'
      choose_keyword '24 HOUR MAXIMUM TEMPERATURE'
      click_on 'Add Keyword'

      choose_keyword 'EARTH SCIENCE'
      choose_keyword 'SOLID EARTH'
      choose_keyword 'ROCKS/MINERALS/CRYSTALS'
      choose_keyword 'SEDIMENTARY ROCKS'
      choose_keyword 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES'
      choose_keyword 'LUMINESCENCE'
      click_on 'Add Keyword'

      within '.multiple.ancillary-keywords' do
        within '.multiple-item-0' do
          find('input').set 'Ancillary keyword 1'
          click_on 'Add another Ancillary Keyword'
        end
        within '.multiple-item-1' do
          find('input').set 'Ancillary keyword 2'
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      expect(page).to have_content 'EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE > SURFACE TEMPERATURE > MAXIMUM/MINIMUM TEMPERATURE > 24 HOUR MAXIMUM TEMPERATURE'
      expect(page).to have_content 'EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE'

      expect(page).to have_field 'service_draft_draft_ancillary_keywords_0', with: 'Ancillary keyword 1'
      expect(page).to have_field 'service_draft_draft_ancillary_keywords_1', with: 'Ancillary keyword 2'
    end
  end
end
