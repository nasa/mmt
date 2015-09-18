# MMT-25

require 'rails_helper'

describe 'Viewing search results', js: true do
  entry_id = 'doi:10.3334/ORNLDAAC/8_1'

  context 'when selecting a collection from search results' do
    before :each do
      login
      fill_in 'entry_id', with: entry_id
      click_on 'Find'
      click_on entry_id
      open_accordions
    end

    it 'displays the published record page' do
      expect(page).to have_content('PUBLISHED RECORD')
    end

    it 'displays the published record metadata' do
      # Data Identification
      expect(page).to have_content('Entry Id: doi:10.3334/ORNLDAAC/8')
      expect(page).to have_content('Entry Title: Aircraft Flux-Filtered: Univ. Col. (FIFE)')

      # Temporal Extent
      expect(page).to have_content('Beginning Date Time: 1987-05-26T00:00:00.000Z')
      expect(page).to have_content('Ending Date Time: 1989-10-31T00:00:00.000Z')

      # Spatial Extent
      expect(page).to have_content('West Bounding Coordinate: -102.0')
      expect(page).to have_content('North Bounding Coordinate: 40.0')
      expect(page).to have_content('East Bounding Coordinate: -95.0')
      expect(page).to have_content('South Bounding Coordinate: 37.0')

      # Acquisition Information
      expect(page).to have_content('Short Name: PRESSURE TRANSDUCER')
      expect(page).to have_content('Long Name: PRESSURE TRANSDUCER')
      expect(page).to have_content('Short Name: EOSDIS')
      expect(page).to have_content('Long Name: Earth Observing System Data Information System')

      # Distribution Information
      expect(page).to have_content('Fees: $0.00')
    end
  end
end
