describe 'Overview Tab preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        within '.collection-overview-table' do
          expect(page).to have_css('td', text: 'Not Provided', count: 8)
        end
      end

      it 'displays the table with the appropriate labels' do
        within '.collection-overview-table' do
          expect(page).to have_content('Science Keywords:')
          expect(page).to have_content('Spatial Extent:')
          expect(page).to have_content('Data Format(s):')
          expect(page).to have_content('Temporal Extent:')
          expect(page).to have_content('Platform(s):')
          expect(page).to have_content('Data Contributor(s):')
          expect(page).to have_content('Instrument(s):')
          expect(page).to have_content('Version:')

          expect(page).to have_no_content('Metadata Download:')
        end
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'displays the table with the appropriate labels' do
        within '.collection-overview-table' do
          expect(page).to have_content('Science Keywords:')
          expect(page).to have_content('Spatial Extent:')
          expect(page).to have_content('Data Format(s):')
          expect(page).to have_content('Temporal Extent:')
          expect(page).to have_content('Platform(s):')
          expect(page).to have_content('Data Contributor(s):')
          expect(page).to have_content('Instrument(s):')
          expect(page).to have_content('Version:')

          expect(page).to have_no_content('Metadata Download:')
        end
      end

      it 'displays the metadata' do

        within '.collection-overview-table' do
          # Science Keywords
          within all('ul.arrow-tag-group-list')[0] do
            expect(page).to have_content('EARTH SCIENCEATMOSPHEREATMOSPHERIC TEMPERATURESURFACE TEMPERATUREMAXIMUM/MINIMUM TEMPERATURE24 HOUR MAXIMUM TEMPERATURE', normalize_ws: true)
          end
          within all('ul.arrow-tag-group-list')[1] do
            expect(page).to have_content('EARTH SCIENCESOLID EARTHROCKS/MINERALS/CRYSTALSSEDIMENTARY ROCKSSEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIESLUMINESCENCE', normalize_ws: true)
          end

          # Spatial Extent
          expect(page).to have_content('Bounding Rectangle: N: 90.0 S: -90.0 E: 180.0 W: -180.0, N: 58.968602 S: 18.968602 E: -56.9284587 W: -96.9284587', normalize_ws: true)

          # Data Format(s)
          expect(page).to have_content('Archive: kml, jpeg')
          expect(page).to have_content('Distribution: tiff')

          # Temporal Extent
          expect(page).to have_content('Single Date Times: 2015-07-01, 2015-12-25', normalize_ws: true)
          expect(page).to have_content('Range Date Times: 2014-07-01 to 2014-08-01, 2015-07-01 to 2015-08-01', normalize_ws: true)
          expect(page).to have_content('Periodic Ranges: 2015-07-01 to 2015-08-01, 2016-07-01 to 2016-08-01', normalize_ws: true)

          # Platform(s)
          expect(page).to have_content('A340-600')
          expect(page).to have_content('SMAP')

          # Data Contributor(s)
          expect(page).to have_content('ESA/ED')

          # Instrument(s)
          expect(page).to have_content('ATM')
          expect(page).to have_content('LVIS')
          expect(page).to have_content('ADS')
          expect(page).to have_content('SMAP L-BAND RADIOMETER')

          # Version
          expect(page).to have_content('1')

        end
      end
    end
  end
end
