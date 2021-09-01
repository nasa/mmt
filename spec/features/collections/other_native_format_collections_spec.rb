describe 'Viewing Collections with other native formats', js: true do
  context 'when viewing a dif10 record that has a Data Center with Archiver role' do
    let(:short_name) { 'AIRG2SSD' }

    before do
      login
      visit manage_collections_path
    end

    context 'when viewing the collection preview page' do
      before do
        fill_in 'keyword', with: short_name
        click_on 'Search Collections'
        click_link short_name
      end

      it 'displays the data center in the collection preview overview table' do
        expect(page).to have_content(short_name)
        expect(page).to have_content('AIRS/Aqua L2G Precipitation Estimate V006 (AIRG2SSD) at GES DISC')

        within '.collection-overview-table' do
          expect(page).to have_content('Data Center(s): NASA/GSFC/SED/ESD/GCDC/GESDISC', normalize_ws: true)
        end
      end

      context 'when clicking to view the additional information tab' do
        before do
          find('.tab-label', text: 'Additional Information').click
        end

        it 'displays the data center and correct role' do
          within '.data-centers-preview' do
            within all('li.data-center')[0] do
              expect(page).to have_content('NASA/GSFC/SED/ESD/GCDC/GESDISC')
              expect(page).to have_content('ARCHIVER')

              expect(page).to have_content('Goddard Earth Sciences Data and Information Services Center (formerly Goddard DAAC), Global Change Data Center, Earth Sciences Division, Science and Exploration Directorate, Goddard Space Flight Center, NASA')
            end
          end
        end
      end
    end
  end
end
