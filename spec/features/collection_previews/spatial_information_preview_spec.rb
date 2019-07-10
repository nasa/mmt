describe 'Spatial information preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

        find('.tab-label', text: 'Additional Information').click
      end

      it 'does not display metadata' do
        expect(page).to have_content('There is no spatial information for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

        find('.tab-label', text: 'Additional Information').click
      end

      it 'displays the metadata' do
        within '.spatial-extent-table' do
          within all('tr')[1] do
            expect(page).to have_content('HORIZONTAL Zone ID CARTESIAN CARTESIAN', normalize_ws: true)
          end
        end

        within '.tiling-identification-systems-table' do
          within all('tr')[1] do
            expect(page).to have_content('MISR -50 50 -30 30', normalize_ws: true)
          end
          within all('tr')[2] do
            expect(page).to have_content('MODIS Tile EASE -25 25 -15 15', normalize_ws: true)
          end
        end

        within '.spatial-information-table' do
          within all('tr')[0] do
            expect(page).to have_content('Spatial Coverage Type: Vertical & Horizontal')
          end
          within all('tr')[1] do
            expect(page).to have_content('Hor. Datum Name Ellipsoid Name Semi Major Axis Flattening Ratio Denominator', normalize_ws: true)
          end
          within all('tr')[2] do
            expect(page).to have_content('Datum name Ellipsoid name 3.0 4.0', normalize_ws: true)
          end
          within all('tr')[3] do
            expect(page).to have_content('Vert. Datum Name Distance Units Resolutions', normalize_ws: true)
          end
          within all('tr')[4] do
            expect(page).to have_content('Datum HectoPascals [1.0, 2.0, 3.0]', normalize_ws: true)
          end
        end

        within '.location-keywords-preview' do
          within all('ul')[0] do
            expect(page).to have_content('GEOGRAPHIC REGIONARCTIC', normalize_ws: true)
          end
          within all('ul')[1] do
            expect(page).to have_content('OCEANATLANTIC OCEAN', normalize_ws: true)
          end
        end
      end
    end
  end
end
