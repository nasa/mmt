# MMT-25

require 'rails_helper'

describe 'Viewing search results', js: true do
  short_name = 'CIESIN_SEDAC_ESI_2000'

  context 'when selecting a collection from search results' do
    before do
      login
      fill_in 'Quick Find', with: short_name
      click_on 'Find'
      click_on short_name
      open_accordions
    end

    it 'displays the published record page' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collections')
        expect(page).to have_content(short_name)
      end
    end

    it 'displays the published record metadata' do
      # Data Identification
      expect(page).to have_content(short_name)
      expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')

      # Temporal Extent
      expect(page).to have_content('1978-01-01 to 1999-12-31')

      # Spatial Extent
      expect(page).to have_content('W: -180.0')
      expect(page).to have_content('N: 90.0')
      expect(page).to have_content('E: 180.0')
      expect(page).to have_content('S: -55.0')

      # Acquisition Information
      expect(page).to have_content('ESI')
    end
  end
end
