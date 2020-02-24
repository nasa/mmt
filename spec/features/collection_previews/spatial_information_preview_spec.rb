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
            expect(page).to have_content('HORIZONTAL Zone ID CARTESIAN CARTESIAN')
          end
        end

        within '.resolution_and_coordinate_system' do
          expect(page).to have_content('Description:')
          expect(page).to have_content('ResolutionAndCoordinateSystem Description')

          within '.geodetic_model_table' do
            within all('tr')[0] do
              expect(page).to have_content('Datum Name Ellipsoid Name Semi Major Axis Flattening Ratio Denominator')
            end
            within all('tr')[1] do
              expect(page).to have_content('HorizontalDatumName Text EllipsoidName Text 1.0 1.0')
            end
          end

          within '.point_resolution' do
            expect(page).to have_content('Point Resolution')
            expect(page).to have_content('Horizontal Resolution Processing Level Enum')
            expect(page).to have_content('Point')
          end

          within '.varies_resolution' do
            expect(page).to have_content('Varies Resolution')
            expect(page).to have_content('Horizontal Resolution Processing Level Enum')
            expect(page).to have_content('Varies')
          end

          within '.non_gridded_resolutions' do
            expect(page).to have_content('Non Gridded Resolutions')
            within '.non_gridded_resolution_0' do
              expect(page).to have_content('1 Meters')
              expect(page).to have_content('2 Meters')
              expect(page).to have_content('At Nadir')
              expect(page).to have_content('Cross Track')
            end
          end

          within '.non_gridded_range_resolutions' do
            expect(page).to have_content('Non Gridded Range Resolutions')
            within '.non_gridded_range_resolution_0' do
              expect(page).to have_content('3 Meters')
              expect(page).to have_content('4 Meters')
              expect(page).to have_content('5 Meters')
              expect(page).to have_content('6 Meters')
              expect(page).to have_content('At Nadir')
              expect(page).to have_content('Cross Track')
            end
          end

          within '.gridded_resolutions' do
            expect(page).to have_content('Gridded Resolutions')
            within '.gridded_resolution_0' do
              expect(page).to have_content('7 Meters')
              expect(page).to have_content('8 Meters')
            end
          end

          within '.gridded_range_resolutions' do
            expect(page).to have_content('Gridded Range Resolutions')
            within '.gridded_range_resolution_0' do
              expect(page).to have_content('9 Meters')
              expect(page).to have_content('10 Meters')
              expect(page).to have_content('11 Meters')
              expect(page).to have_content('12 Meters')
            end
          end

          within '.generic_resolutions' do
            expect(page).to have_content('Generic Resolutions')
            within '.generic_resolution_0' do
              expect(page).to have_content('13 Meters')
              expect(page).to have_content('14 Meters')
            end
          end
        end

        within '.tiling-identification-systems-table' do
          within all('tr')[1] do
            expect(page).to have_content('MISR -50 50 -30 30')
          end
          within all('tr')[2] do
            expect(page).to have_content('MODIS Tile EASE -25 25 -15 15')
          end
        end

        within '.spatial-information-table' do
          within all('tr')[0] do
            expect(page).to have_content('Coverage Type Datum Name Distance Units Resolutions')
          end
          within all('tr')[1] do
            expect(page).to have_content('VERTICAL Datum HectoPascals [1.0, 2.0, 3.0]')
          end
        end

        within '.location-keywords-preview' do
          within all('ul')[0] do
            expect(page).to have_content('GEOGRAPHIC REGIONARCTIC')
          end
          within all('ul')[1] do
            expect(page).to have_content('OCEANATLANTIC OCEAN')
          end
        end
      end
    end
  end
end
