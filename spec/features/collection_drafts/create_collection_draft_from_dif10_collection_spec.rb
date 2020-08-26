describe 'Create and edit a draft from a Dif 10 collection with location keywords', js: true do
  short_name = 'SWDB_L310'

  before do
    login(provider: 'LARC', providers: %w[MMT_2 LARC])
    visit manage_collections_path
  end

  context 'when searching for a Dif 10 collection' do
    before do
      # search for the record, by short_name
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
      expect(page).to have_content(short_name)
      click_on short_name

      find('.tab-label', text: 'Additional Information').click
    end


    it 'imports the location keywords' do
      # test for location keywords on preview page
      within '.location-keywords-preview' do
        expect(page).to have_content('GEOGRAPHIC REGION GLOBAL', normalize_ws: true)
      end
    end

    context 'when editing the record with more location keywords' do
      before do
        click_on 'Edit Collection Record'

        within '#loss-report-modal' do
          click_on 'Edit Collection'
        end
        
        within '.metadata' do
          click_on 'Spatial Information', match: :first
        end

        click_on 'Expand All'

        add_location_keywords

        within '.nav-top' do
          click_on 'Done'
        end

        find('.tab-label', text: 'Additional Information').click
      end

      it 'displays all the location keywords in the metadata preview' do
        within '.location-keywords-preview' do
          expect(page).to have_content('GEOGRAPHIC REGION GLOBAL', normalize_ws: true)
          expect(page).to have_content('GEOGRAPHIC REGION ARCTIC', normalize_ws: true)
          expect(page).to have_content('OCEAN ATLANTIC OCEAN NORTH ATLANTIC OCEAN BALTIC SEA', normalize_ws: true)
        end
      end
    end
  end
end
