# MMT-25

require 'rails_helper'

describe 'Viewing search results', js: true do
  short_name = 'CIESIN_SEDAC_ESI_2000'

  context 'when selecting a collection from search results' do
    before :each do
      login
      fill_in 'Quick Find', with: short_name
      click_on 'Find'
      click_on short_name
      open_accordions
    end

    it 'displays the published record page' do
      expect(page).to have_content('PUBLISHED RECORD')
    end

    it 'displays the published record metadata' do
      # Data Identification
      expect(page).to have_content("Short Name: #{short_name}")
      expect(page).to have_content('Entry Title: 2000 Pilot Environmental Sustainability Index (ESI)')

      # Temporal Extent
      expect(page).to have_content('Beginning Date Time: 1978-01-01T00:00:00.000Z')
      expect(page).to have_content('Ending Date Time: 1999-12-31T00:00:00.000Z')

      # Spatial Extent
      expect(page).to have_content('West Bounding Coordinate: -180.0')
      expect(page).to have_content('North Bounding Coordinate: 90.0')
      expect(page).to have_content('East Bounding Coordinate: 180.0')
      expect(page).to have_content('South Bounding Coordinate: -55.0')

      # Acquisition Information
      expect(page).to have_content('Short Name: ESI')
      expect(page).to have_content('Long Name: Environmental Sustainability Index')

      # Distribution Information
      expect(page).to have_content('Distribution Format: PDF')
      expect(page).to have_content('Fees: $0.00')
    end
  end
end
