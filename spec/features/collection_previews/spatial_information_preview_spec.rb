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
          expect(page).to have_content('Description: ResolutionAndCoordinateSystem Description')

          within '.geodetic_model_table' do
            within all('tr')[0] do
              expect(page).to have_content('Datum Name Ellipsoid Name Semi Major Axis Flattening Ratio Denominator')
            end
            within all('tr')[1] do
              expect(page).to have_content('HorizontalDatumName Text EllipsoidName Text 1.0 1.0')
            end
          end

          within '.horizontal_data_resolution_0' do
            expect(page).to have_content('Horizontal Resolution Processing Level: Non Gridded Range')
            within '.horizontal-x-dimension-range' do
              within '.two-column-fields-left' do
                expect(page).to have_content('X Dimension Minimum: 1 Meters')
              end

              within '.two-column-fields-right' do
                expect(page).to have_content('X Dimension Maximum: 2 Meters')
              end
            end

            within '.horizontal-y-dimension-range' do
              within '.two-column-fields-left' do
                expect(page).to have_content('Y Dimension Minimum: 3 Meters')
              end

              within '.two-column-fields-right' do
                expect(page).to have_content('Y Dimension Maximum: 4 Meters')
              end
            end
            expect(page).to have_content('Viewing Angle: At Nadir')
            expect(page).to have_content('Scan Direction: Along Track')
          end

          within '.horizontal_data_resolution_1' do
            expect(page).to have_content('Horizontal Resolution Processing Level: Gridded')
            expect(page).to have_content('X Dimension: 1 Meters')
            expect(page).to have_content('Y Dimension: 2 Meters')
          end

          within '.horizontal_data_resolution_2' do
            expect(page).to have_content('Horizontal Resolution Processing Level: Non Gridded')
            expect(page).to have_content('X Dimension: 3 Statute Miles')
            expect(page).to have_content('Y Dimension: 4 Statute Miles')
            expect(page).to have_content('Viewing Angle: At Nadir')
            expect(page).to have_content('Scan Direction: Cross Track')
          end

          within '.horizontal_data_resolution_3' do
            expect(page).to have_content('Horizontal Resolution Processing Level: Varies')
          end

          within '.horizontal_data_resolution_4' do
            expect(page).to have_content('Horizontal Resolution Processing Level: Non Gridded')
            expect(page).to have_content('X Dimension: 5 Statute Miles')
            expect(page).to have_content('Viewing Angle: At Nadir')
            expect(page).to have_content('Scan Direction: Cross Track')
          end

          within '.horizontal_data_resolution_5' do
            expect(page).to have_content('Horizontal Resolution Processing Level: Gridded Range')
            within '.horizontal-y-dimension-range' do
              within '.two-column-fields-left' do
                expect(page).to have_content('Y Dimension Minimum: 6 Meters')
              end

              within '.two-column-fields-right' do
                expect(page).to have_content('Y Dimension Maximum: 7 Meters')
              end
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
