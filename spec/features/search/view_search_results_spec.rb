describe 'Viewing search results', js: true do
  short_name = 'CIESIN_SEDAC_ESI_2000'

  context 'when selecting a collection from search results' do
    before do
      login
      visit manage_collections_path

      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
      click_on short_name
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
      expect(page).to have_content('1978-01-01')
      expect(page).to have_content('1999-12-31')

      # Spatial Extent
      expect(page).to have_content('-180.0')
      expect(page).to have_content('90.0')
      expect(page).to have_content('180.0')

      # Acquisition Information
      expect(page).to have_content('ESI')
    end
  end
end
