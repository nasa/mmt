require 'rails_helper'

describe 'Acquisition Information Form', reset_provider: true, js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'acquisition_information')
  end

  context 'when submitting the form' do
    before do
      within '.multiple.platforms' do
        all('.select2-container .select2-selection').first.click
        find(:xpath, '//body').find('.select2-dropdown ul.select2-results__options--nested li.select2-results__option', text: 'A340-600').click

        within '.multiple.instruments' do
          all('.select2-container .select2-selection').first.click
          find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'ATM').click

          click_on 'Add another Instrument'
          within '.multiple-item-1' do
            all('.select2-container .select2-selection').first.click
            find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'LVIS').click
          end
        end

        click_on 'Add another Platform'
        within '.multiple-item-1' do
          all('.select2-container .select2-selection').first.click
          find(:xpath, '//body').find('.select2-dropdown ul.select2-results__options--nested li.select2-results__option', text: 'DMSP 5B/F3').click

          within '.multiple.instruments' do
            all('.select2-container .select2-selection').first.click
            find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'ACOUSTIC SOUNDERS').click
          end
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      expect(page).to have_field('service_draft_draft_platforms_0_short_name', with: 'A340-600')
      expect(page).to have_field('service_draft_draft_platforms_0_long_name', with: 'Airbus A340-600')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_short_name', with: 'ATM')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_long_name', with: 'Airborne Topographic Mapper')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_short_name', with: 'LVIS')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_long_name', with: 'Land, Vegetation, and Ice Sensor')

      expect(page).to have_field('service_draft_draft_platforms_1_short_name', with: 'DMSP 5B/F3')
      expect(page).to have_field('service_draft_draft_platforms_1_long_name', with: 'Defense Meteorological Satellite Program-F3')
      expect(page).to have_field('service_draft_draft_platforms_1_instruments_0_short_name', with: 'ACOUSTIC SOUNDERS')
    end
  end
end
