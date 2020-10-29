describe 'Spatial information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end
  
  context 'when checking the accordion headers for required icons' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end
    end

    it 'displays required icons on the Spatial Extents accordion' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Spatial Extent')
    end
  end

  context 'when submitting the form with horizontal spatial' do
    context 'when submitting points geometry' do
      before do
        within '.metadata' do
          click_on 'Spatial Information', match: :first
        end

        click_on 'Expand All'

        # Spatial Extent
        select 'Horizontal', from: 'Spatial Coverage Type'
        fill_in 'Zone Identifier', with: 'Zone ID'
        within '.geometry' do
          choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
          add_points
        end
        select 'Cartesian', from: 'Granule Spatial Representation'
        within '.resolution-and-coordinate-system' do
          fill_in 'Description', with: 'Sample description'
          fill_in 'Horizontal Datum Name', with: 'Datum name'
          fill_in 'Ellipsoid Name', with: 'Ellipsoid name'
          fill_in 'Semi Major Axis', with: '3.0'
          fill_in 'Denominator Of Flattening Ratio', with: '4.0'
          choose 'Horizontal Data Resolution'
          within '.horizontal-data-resolution-fields' do
            check 'Point Resolution'

            check 'Varies Resolution'

            check 'Gridded Resolutions'
            within '.horizontal-data-resolution-fields.gridded-resolutions' do
              fill_in 'X Dimension', with: '1'
              fill_in 'Y Dimension', with: '2'
              select 'Meters', from: 'Unit'
            end

            check 'Gridded Range Resolutions'
            within '.horizontal-data-resolution-fields.gridded-range-resolutions' do
              fill_in 'Minimum X Dimension', with: '3'
              fill_in 'Maximum X Dimension', with: '4'
              fill_in 'Minimum Y Dimension', with: '5'
              fill_in 'Maximum Y Dimension', with: '6'
              select 'Meters', from: 'Unit'
            end

            check 'Non Gridded Resolutions'
            within '.horizontal-data-resolution-fields.non-gridded-resolutions' do
              fill_in 'X Dimension', with: '7'
              fill_in 'Y Dimension', with: '8'
              select 'At Nadir', from: 'Viewing Angle Type'
              select 'Along Track', from: 'Scan Direction'
              select 'Meters', from: 'Unit'
            end

            check 'Non Gridded Range Resolutions'
            within '.horizontal-data-resolution-fields.non-gridded-range-resolutions' do
              fill_in 'Minimum X Dimension', with: '9'
              fill_in 'Maximum X Dimension', with: '10'
              fill_in 'Minimum Y Dimension', with: '11'
              fill_in 'Maximum Y Dimension', with: '12'
              select 'At Nadir', from: 'Viewing Angle Type'
              select 'Along Track', from: 'Scan Direction'
              select 'Meters', from: 'Unit'
            end

            check 'Generic Resolutions'
            within '.horizontal-data-resolution-fields.generic-resolutions' do
              fill_in 'X Dimension', with: '13'
              fill_in 'Y Dimension', with: '14'
              select 'Meters', from: 'Unit'
            end
          end
        end

        # Tiling Identification System
        within '.multiple.tiling-identification-systems' do
          select 'MODIS Tile SIN', from: 'Tiling Identification System Name'
          within first('.tiling-coordinate') do
            fill_in 'Minimum Value', with: '-50.0'
            fill_in 'Maximum Value', with: '50.0'
          end
          within all('.tiling-coordinate').last do
            fill_in 'Minimum Value', with: '-30.0'
            fill_in 'Maximum Value', with: '30.0'
          end
          click_on 'Add another Tiling Identification System'

          within '.multiple-item-1' do
            select 'MODIS Tile EASE', from: 'Tiling Identification System Name'
            within first('.tiling-coordinate') do
              fill_in 'Minimum Value', with: '-25.0'
              fill_in 'Maximum Value', with: '25.0'
            end
            within all('.tiling-coordinate').last do
              fill_in 'Minimum Value', with: '-15.0'
              fill_in 'Maximum Value', with: '15.0'
            end
          end
        end

        # Spatial Representation Information is not filled in in this case

        # Location Keywords
        add_location_keywords

        within '.nav-top' do
          click_on 'Save'
        end

        # output_schema_validation Draft.first.draft
        click_on 'Expand All'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Updated Successfully!')
      end

      it 'contains the correct dropdown options' do
        within '#draft_tiling_identification_systems_0' do
          expect(page).to have_select('Tiling Identification System Name', options: ['Select Tiling Identification System Name', 'CALIPSO', 'MISR', 'MODIS Tile EASE', 'MODIS Tile SIN', 'WELD Alaska Tile', 'WELD CONUS Tile', 'WRS-1', 'WRS-2', 'Military Grid Reference System'])
        end
      end

      it 'populates the form with the values including horizontal spatial data' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_field('Spatial Coverage Type', with: 'HORIZONTAL')
          expect(page).to have_field('Zone Identifier', with: 'Zone ID')
          within '.geometry' do
            expect(page).to have_checked_field('Cartesian')
            expect(page).to have_no_checked_field('Geodetic')
            # Points
            within first('.multiple.points') do
              expect(page).to have_field('Longitude', with: '-77.047878')
              expect(page).to have_field('Latitude', with: '38.805407')
              within '.multiple-item-1' do
                expect(page).to have_field('Longitude', with: '-76.9284587')
                expect(page).to have_field('Latitude', with: '38.968602')
              end
            end
          end
          within '.resolution-and-coordinate-system' do
            expect(page).to have_field('Description', with: 'Sample description')
            expect(page).to have_field('Horizontal Datum Name', with: 'Datum name')
            expect(page).to have_field('Ellipsoid Name', with: 'Ellipsoid name')
            expect(page).to have_field('Semi Major Axis', with: '3.0')
            expect(page).to have_field('Denominator Of Flattening Ratio', with: '4.0')
            expect(page).to have_checked_field('Horizontal Data Resolution')

            within '.horizontal-data-resolution' do
              expect(page).to have_checked_field('Point Resolution')
              expect(page).to have_checked_field('Point')

              expect(page).to have_checked_field('Varies Resolution')
              expect(page).to have_checked_field('Varies')

              within '.horizontal-data-resolution-fields.gridded-resolutions' do
                expect(page).to have_field('X Dimension', with: '1.0')
                expect(page).to have_field('Y Dimension', with: '2.0')
                expect(page).to have_field('Unit', with: 'Meters')
              end
              within '.horizontal-data-resolution-fields.gridded-range-resolutions' do
                expect(page).to have_field('Minimum X Dimension', with: '3.0')
                expect(page).to have_field('Maximum X Dimension', with: '4.0')
                expect(page).to have_field('Minimum Y Dimension', with: '5.0')
                expect(page).to have_field('Maximum Y Dimension', with: '6.0')
                expect(page).to have_field('Unit', with: 'Meters')
              end
              within '.horizontal-data-resolution-fields.non-gridded-resolutions' do
                expect(page).to have_field('X Dimension', with: '7.0')
                expect(page).to have_field('Y Dimension', with: '8.0')
                expect(page).to have_field('Unit', with: 'Meters')
                expect(page).to have_field('Viewing Angle Type', with: 'At Nadir')
                expect(page).to have_field('Scan Direction', with: 'Along Track')
              end
              within '.horizontal-data-resolution-fields.non-gridded-range-resolutions' do
                expect(page).to have_field('Minimum X Dimension', with: '9.0')
                expect(page).to have_field('Maximum X Dimension', with: '10.0')
                expect(page).to have_field('Minimum Y Dimension', with: '11.0')
                expect(page).to have_field('Maximum Y Dimension', with: '12.0')
                expect(page).to have_field('Unit', with: 'Meters')
                expect(page).to have_field('Viewing Angle Type', with: 'At Nadir')
                expect(page).to have_field('Scan Direction', with: 'Along Track')
              end
              within '.horizontal-data-resolution-fields.generic-resolutions' do
                expect(page).to have_field('X Dimension', with: '13.0')
                expect(page).to have_field('Y Dimension', with: '14.0')
                expect(page).to have_field('Unit', with: 'Meters')
              end
            end
          end
          expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
        end

        # Tiling Identification System
        within '.multiple.tiling-identification-systems' do
          within '.multiple-item-0' do
            expect(page).to have_field('Tiling Identification System Name', with: 'MODIS Tile SIN')
            within first('.tiling-coordinate') do
              expect(page).to have_field('Minimum Value', with: '-50.0')
              expect(page).to have_field('Maximum Value', with: '50.0')
            end
            within all('.tiling-coordinate').last do
              expect(page).to have_field('Minimum Value', with: '-30.0')
              expect(page).to have_field('Maximum Value', with: '30.0')
            end
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Tiling Identification System Name', with: 'MODIS Tile EASE')
            within first('.tiling-coordinate') do
              expect(page).to have_field('Minimum Value', with: '-25.0')
              expect(page).to have_field('Maximum Value', with: '25.0')
            end
            within all('.tiling-coordinate').last do
              expect(page).to have_field('Minimum Value', with: '-15.0')
              expect(page).to have_field('Maximum Value', with: '15.0')
            end
          end
        end

        # Spatial Representation Information is empty in this case

        # Location Keywords
        expect(page).to have_content('GEOGRAPHIC REGION > ARCTIC')
        expect(page).to have_content('OCEAN > ATLANTIC OCEAN > NORTH ATLANTIC OCEAN > BALTIC SEA')
      end
    end

    context 'when submitting bounding rectangles geometry' do
      before do
        within '.metadata' do
          click_on 'Spatial Information', match: :first
        end

        click_on 'Expand All'

        # Spatial Extent
        select 'Horizontal', from: 'Spatial Coverage Type'
        fill_in 'Zone Identifier', with: 'Zone ID'
        within '.geometry' do
          choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        end
        add_bounding_rectangles
        select 'Cartesian', from: 'Granule Spatial Representation'

        within '.nav-top' do
          click_on 'Save'
        end
        # output_schema_validation Draft.first.draft
        click_on 'Expand All'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Updated Successfully!')
      end

      it 'populates the form with the values including horizontal spatial data' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_field('Spatial Coverage Type', with: 'HORIZONTAL')
          expect(page).to have_field('Zone Identifier', with: 'Zone ID')
          within '.geometry' do
            expect(page).to have_checked_field('Cartesian')
            expect(page).to have_no_checked_field('Geodetic')
            # BoundingRectangles
            within '.multiple.bounding-rectangles' do
              expect(page).to have_field('West', with: '-180.0')
              expect(page).to have_field('North', with: '90.0')
              expect(page).to have_field('East', with: '180.0')
              expect(page).to have_field('South', with: '-90.0')
              within '.multiple-item-1' do
                expect(page).to have_field('West', with: '-96.9284587')
                expect(page).to have_field('North', with: '58.968602')
                expect(page).to have_field('East', with: '-56.9284587')
                expect(page).to have_field('South', with: '18.968602')
              end
            end
          end
          expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
        end
      end
    end

    context 'when submitting g polygons geometry' do
      before do
        within '.metadata' do
          click_on 'Spatial Information', match: :first
        end

        click_on 'Expand All'

        # Spatial Extent
        select 'Horizontal', from: 'Spatial Coverage Type'
        fill_in 'Zone Identifier', with: 'Zone ID'
        within '.geometry' do
          choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        end
        add_g_polygons
        select 'Cartesian', from: 'Granule Spatial Representation'

        within '.nav-top' do
          click_on 'Save'
        end
        # output_schema_validation Draft.first.draft
        click_on 'Expand All'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Updated Successfully!')
      end

      it 'populates the form with the values including horizontal spatial data' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_field('Spatial Coverage Type', with: 'HORIZONTAL')
          expect(page).to have_field('Zone Identifier', with: 'Zone ID')
          within '.geometry' do
            expect(page).to have_checked_field('Cartesian')
            expect(page).to have_no_checked_field('Geodetic')
            # GPolygons
            within '.multiple.g-polygons > .multiple-item-0' do
              # within '.point' do
              #   expect(page).to have_field('Longitude', with: '0.0')
              #   expect(page).to have_field('Latitude', with: '0.0')
              # end
              within '.boundary .multiple.points' do
                expect(page).to have_field('Longitude', with: '10.0')
                expect(page).to have_field('Latitude', with: '10.0')
                within '.multiple-item-1' do
                  expect(page).to have_field('Longitude', with: '-10.0')
                  expect(page).to have_field('Latitude', with: '10.0')
                end
                within '.multiple-item-2' do
                  expect(page).to have_field('Longitude', with: '-10.0')
                  expect(page).to have_field('Latitude', with: '-10.0')
                end
                within '.multiple-item-3' do
                  expect(page).to have_field('Longitude', with: '10.0')
                  expect(page).to have_field('Latitude', with: '-10.0')
                end
              end
              within '.exclusive-zone' do
                within '.multiple.boundaries' do
                  expect(page).to have_field('Longitude', with: '5.0')
                  expect(page).to have_field('Latitude', with: '5.0')
                  within '.multiple-item-1' do
                    expect(page).to have_field('Longitude', with: '-5.0')
                    expect(page).to have_field('Latitude', with: '5.0')
                  end
                  within '.multiple-item-2' do
                    expect(page).to have_field('Longitude', with: '-5.0')
                    expect(page).to have_field('Latitude', with: '-5.0')
                  end
                  within '.multiple-item-3' do
                    expect(page).to have_field('Longitude', with: '5.0')
                    expect(page).to have_field('Latitude', with: '-5.0')
                  end
                end
              end
            end
            within '.multiple.g-polygons > .multiple-item-1' do
              within '.boundary .multiple.points' do
                expect(page).to have_field('Longitude', with: '38.98828125')
                expect(page).to have_field('Latitude', with: '-77.044921875')
                within '.multiple-item-1' do
                  expect(page).to have_field('Longitude', with: '38.935546875')
                  expect(page).to have_field('Latitude', with: '-77.1240234375')
                end
                within '.multiple-item-2' do
                  expect(page).to have_field('Longitude', with: '38.81689453125')
                  expect(page).to have_field('Latitude', with: '-77.02734375')
                end
                within '.multiple-item-3' do
                  expect(page).to have_field('Longitude', with: '38.900390625')
                  expect(page).to have_field('Latitude', with: '-76.9130859375')
                end
              end
            end
          end
          expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
        end
      end
    end

    context 'when submitting lines geometry' do
      before do
        within '.metadata' do
          click_on 'Spatial Information', match: :first
        end

        click_on 'Expand All'

        # Spatial Extent
        select 'Horizontal', from: 'Spatial Coverage Type'
        fill_in 'Zone Identifier', with: 'Zone ID'
        within '.geometry' do
          choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        end
        add_lines
        select 'Cartesian', from: 'Granule Spatial Representation'

        within '.nav-top' do
          click_on 'Save'
        end
        # output_schema_validation Draft.first.draft
        click_on 'Expand All'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Updated Successfully!')
      end

      it 'populates the form with the values including horizontal spatial data' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_field('Spatial Coverage Type', with: 'HORIZONTAL')
          expect(page).to have_field('Zone Identifier', with: 'Zone ID')
          within '.geometry' do
            expect(page).to have_checked_field('Cartesian')
            expect(page).to have_no_checked_field('Geodetic')
            # Lines
            within '.multiple.lines > .multiple-item-0' do
              within '.multiple.points > .multiple-item-0' do
                expect(page).to have_field('Longitude', with: '24.0')
                expect(page).to have_field('Latitude', with: '24.0')
              end
              within '.multiple.points > .multiple-item-1' do
                expect(page).to have_field('Longitude', with: '26.0')
                expect(page).to have_field('Latitude', with: '26.0')
              end
            end
            within '.multiple.lines > .multiple-item-1' do
              within '.multiple.points > .multiple-item-0' do
                expect(page).to have_field('Longitude', with: '24.0')
                expect(page).to have_field('Latitude', with: '26.0')
              end
              within '.multiple.points > .multiple-item-1' do
                expect(page).to have_field('Longitude', with: '26.0')
                expect(page).to have_field('Latitude', with: '24.0')
              end
            end
          end
          expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
        end
      end
    end
  end

  context 'when submitting the form with vertical spatial' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      click_on 'Expand All'

      # Spatial Extent
      select 'Vertical', from: 'Spatial Coverage Type'
      within '.multiple.vertical-spatial-domains' do
        select 'Maximum Altitude', from: 'Type'
        fill_in 'Value', with: 'domain value'
        click_on 'Add another Vertical Spatial Domain'
        within '.multiple-item-1' do
          select 'Maximum Depth', from: 'Type'
          fill_in 'Value', with: 'domain value 1'
        end
      end
      select 'Cartesian', from: 'Granule Spatial Representation'

      # Spatial Representation Information
      choose 'draft_spatial_information_spatial_coverage_type_VERTICAL'
      within '.altitude-system-definition' do
        fill_in 'Datum Name', with: 'datum name'
        select 'Kilometers', from: 'Distance Units'
        within '.multiple.resolutions' do
          within '.multiple-item-0' do
            find('.resolution').set '3.0'
            click_on 'Add another Resolution'
          end
          within '.multiple-item-1' do
            find('.resolution').set '4.0'
          end
        end
      end
      within '.depth-system-definition' do
        fill_in 'Datum Name', with: 'datum name 1'
        select 'Meters', from: 'Distance Units'
        within '.multiple.resolutions' do
          within '.multiple-item-0' do
            find('.resolution').set '5.0'
            click_on 'Add another Resolution'
          end
          within '.multiple-item-1' do
            find('.resolution').set '6.0'
          end
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values including vertical spatial data' do
      # Spatial Extent
      within '.spatial-extent' do
        expect(page).to have_field('Spatial Coverage Type', with: 'VERTICAL')

        within '.multiple.vertical-spatial-domains' do
          expect(page).to have_field('Type', with: 'Maximum Altitude')
          expect(page).to have_field('Value', with: 'domain value')
          expect(page).to have_field('Type', with: 'Maximum Depth')
          expect(page).to have_field('Value', with: 'domain value 1')
        end
        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end

      # Spatial Representation Information
      expect(page).to have_no_checked_field('Horizontal')
      expect(page).to have_checked_field('Vertical')
      expect(page).to have_no_checked_field('Both')
      within '.altitude-system-definition' do
        expect(page).to have_field('Datum Name', with: 'datum name')
        expect(page).to have_field('Distance Units', with: 'Kilometers')
        expect(page).to have_selector('input.resolution[value="3.0"]')
        expect(page).to have_selector('input.resolution[value="4.0"]')
      end
      within '.depth-system-definition' do
        expect(page).to have_field('Datum Name', with: 'datum name 1')
        expect(page).to have_field('Distance Units', with: 'Meters')
        expect(page).to have_selector('input.resolution[value="5.0"]')
        expect(page).to have_selector('input.resolution[value="6.0"]')
      end
    end
  end

  context 'when submitting the form with orbital spatial' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      click_on 'Expand All'

      # Spatial Extent
      select 'Orbital', from: 'Spatial Coverage Type'
      fill_in 'Swath Width', with: '1'
      fill_in 'Period', with: '2'
      fill_in 'Inclination Angle', with: '3'
      fill_in 'Number Of Orbits', with: '4'
      fill_in 'Start Circular Latitude', with: '5'

      select 'Cartesian', from: 'Granule Spatial Representation'

      # Spatial Representation Information
      choose 'draft_spatial_information_spatial_coverage_type_VERTICAL'

      within '.altitude-system-definition' do
        fill_in 'Datum Name', with: 'datum name'
        select 'Kilometers', from: 'Distance Units'
        within '.multiple.resolutions' do
          within '.multiple-item-0' do
            find('.resolution').set '3.0'
            click_on 'Add another Resolution'
          end
          within '.multiple-item-1' do
            find('.resolution').set '4.0'
          end
        end
      end
      within '.depth-system-definition' do
        fill_in 'Datum Name', with: 'datum name 1'
        select 'Meters', from: 'Distance Units'
        within '.multiple.resolutions' do
          within '.multiple-item-0' do
            find('.resolution').set '5.0'
            click_on 'Add another Resolution'
          end
          within '.multiple-item-1' do
            find('.resolution').set '6.0'
          end
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values including orbital spatial data' do
      # Spatial Extent
      within '.spatial-extent' do
        expect(page).to have_field('Spatial Coverage Type', with: 'ORBITAL')

        expect(page).to have_field('Swath Width', with: '1.0')
        expect(page).to have_field('Period', with: '2.0')
        expect(page).to have_field('Inclination Angle', with: '3.0')
        expect(page).to have_field('Number Of Orbits', with: '4.0')
        expect(page).to have_field('Start Circular Latitude', with: '5.0')

        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end

      # Spatial Representation Information
      expect(page).to have_checked_field('Vertical')

      within '.altitude-system-definition' do
        expect(page).to have_field('Datum Name', with: 'datum name')
        expect(page).to have_field('Distance Units', with: 'Kilometers')
        expect(page).to have_selector('input.resolution[value="3.0"]')
        expect(page).to have_selector('input.resolution[value="4.0"]')
      end
      within '.depth-system-definition' do
        expect(page).to have_field('Datum Name', with: 'datum name 1')
        expect(page).to have_field('Distance Units', with: 'Meters')
        expect(page).to have_selector('input.resolution[value="5.0"]')
        expect(page).to have_selector('input.resolution[value="6.0"]')
      end
    end
  end

  context 'when submitting the form with horizontal and vertical spatial' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      click_on 'Expand All'

      # Spatial Extent
      select 'Horizontal and Vertical', from: 'Spatial Coverage Type'
      # Horizontal
      fill_in 'Zone Identifier', with: 'Zone ID'
      within '.geometry' do
        choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        add_points
      end
      # Vertical
      within '.multiple.vertical-spatial-domains' do
        select 'Maximum Altitude', from: 'Type'
        fill_in 'Value', with: 'domain value'
        click_on 'Add another Vertical Spatial Domain'
        within '.multiple-item-1' do
          select 'Maximum Depth', from: 'Type'
          fill_in 'Value', with: 'domain value 1'
        end
      end

      select 'Cartesian', from: 'Granule Spatial Representation'

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values including orbital spatial data' do
      # Spatial Extent
      within '.spatial-extent' do
        expect(page).to have_field('Spatial Coverage Type', with: 'HORIZONTAL_VERTICAL')

        expect(page).to have_field('Zone Identifier', with: 'Zone ID')
        within '.geometry' do
          expect(page).to have_checked_field('Cartesian')
          expect(page).to have_no_checked_field('Geodetic')
          # Points
          within first('.multiple.points') do
            expect(page).to have_field('Longitude', with: '-77.047878')
            expect(page).to have_field('Latitude', with: '38.805407')
            within '.multiple-item-1' do
              expect(page).to have_field('Longitude', with: '-76.9284587')
              expect(page).to have_field('Latitude', with: '38.968602')
            end
          end
        end

        within '.multiple.vertical-spatial-domains' do
          expect(page).to have_field('Type', with: 'Maximum Altitude')
          expect(page).to have_field('Value', with: 'domain value')
          expect(page).to have_field('Type', with: 'Maximum Depth')
          expect(page).to have_field('Value', with: 'domain value 1')
        end

        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end
    end
  end

  context 'when submitting the form with orbital and vertical spatial' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      click_on 'Expand All'

      # Spatial Extent
      select 'Orbital and Vertical', from: 'Spatial Coverage Type'
      # Orbital
      fill_in 'Swath Width', with: '1'
      fill_in 'Period', with: '2'
      fill_in 'Inclination Angle', with: '3'
      fill_in 'Number Of Orbits', with: '4'
      fill_in 'Start Circular Latitude', with: '5'
      # Vertical
      within '.multiple.vertical-spatial-domains' do
        select 'Maximum Altitude', from: 'Type'
        fill_in 'Value', with: 'domain value'
        click_on 'Add another Vertical Spatial Domain'
        within '.multiple-item-1' do
          select 'Maximum Depth', from: 'Type'
          fill_in 'Value', with: 'domain value 1'
        end
      end

      select 'Cartesian', from: 'Granule Spatial Representation'

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values including orbital spatial data' do
      # Spatial Extent
      within '.spatial-extent' do
        expect(page).to have_field('Spatial Coverage Type', with: 'ORBITAL_VERTICAL')

        expect(page).to have_field('Swath Width', with: '1.0')
        expect(page).to have_field('Period', with: '2.0')
        expect(page).to have_field('Inclination Angle', with: '3.0')
        expect(page).to have_field('Number Of Orbits', with: '4.0')
        expect(page).to have_field('Start Circular Latitude', with: '5.0')

        within '.multiple.vertical-spatial-domains' do
          expect(page).to have_field('Type', with: 'Maximum Altitude')
          expect(page).to have_field('Value', with: 'domain value')
          expect(page).to have_field('Type', with: 'Maximum Depth')
          expect(page).to have_field('Value', with: 'domain value 1')
        end

        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end
    end
  end
end

describe 'Spatial information form when draft has no spatial coverage type', js: true do
  before do
    login
    draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    # The collection draft created from that factory has spatial_coverage_type
    # with horizontal, and horizontal data filled in. With the changes in
    # MMT-2186, the page should load with the horizontal data visible even after
    # removing the spatial coverage type
    draft.draft['SpatialExtent']['SpatialCoverageType'] = nil
    draft.save
    visit edit_collection_draft_path(draft, form: 'spatial_information')

    click_on 'Expand All'
  end

  it 'displays the horizontal spatial extent data' do
    within '.spatial-extent' do
      expect(page).to have_field('Spatial Coverage Type', with: '')
      # Horizontal
      expect(page).to have_field('Zone Identifier', with: 'Zone ID')
      within '.geometry' do
        expect(page).to have_checked_field('Cartesian')
        expect(page).to have_no_checked_field('Geodetic')
        # BoundingRectangles
        within '.multiple.bounding-rectangles' do
          within '.multiple-item-0' do
            expect(page).to have_field('West', with: '-180.0')
            expect(page).to have_field('North', with: '90.0')
            expect(page).to have_field('East', with: '180.0')
            expect(page).to have_field('South', with: '-90.0')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('West', with: '-96.9284587')
            expect(page).to have_field('North', with: '58.968602')
            expect(page).to have_field('East', with: '-56.9284587')
            expect(page).to have_field('South', with: '18.968602')
          end
        end
      end
      within '.resolution-and-coordinate-system' do
        expect(page).to have_field('Description', with: 'ResolutionAndCoordinateSystem Description')
        expect(page).to have_field('Horizontal Datum Name', with: 'HorizontalDatumName Text')
        expect(page).to have_field('Ellipsoid Name', with: 'EllipsoidName Text')
        expect(page).to have_field('Semi Major Axis', with: '1.0')
        expect(page).to have_field('Denominator Of Flattening Ratio', with: '1.0')
        expect(page).to have_checked_field('Horizontal Data Resolution')
        within '.horizontal-data-resolution' do
          expect(page).to have_checked_field('Point Resolution')
          expect(page).to have_checked_field('Point')

          expect(page).to have_checked_field('Varies Resolution')
          expect(page).to have_checked_field('Varies')

          within '.horizontal-data-resolution-fields.non-gridded-resolutions' do
            expect(page).to have_field('X Dimension', with: '1')
            expect(page).to have_field('Y Dimension', with: '2')
            expect(page).to have_field('Unit', with: 'Meters')
            expect(page).to have_field('Viewing Angle Type', with: 'At Nadir')
            expect(page).to have_field('Scan Direction', with: 'Cross Track')
          end
          within '.horizontal-data-resolution-fields.non-gridded-range-resolutions' do
            expect(page).to have_field('Minimum X Dimension', with: '3')
            expect(page).to have_field('Maximum X Dimension', with: '5')
            expect(page).to have_field('Minimum Y Dimension', with: '4')
            expect(page).to have_field('Maximum Y Dimension', with: '6')
            expect(page).to have_field('Unit', with: 'Meters')
            expect(page).to have_field('Viewing Angle Type', with: 'At Nadir')
            expect(page).to have_field('Scan Direction', with: 'Cross Track')
          end
          within '.horizontal-data-resolution-fields.gridded-resolutions' do
            within '.multiple-item-0' do
              expect(page).to have_field('X Dimension', with: '7')
              expect(page).to have_field('Unit', with: 'Meters')
            end
            within '.multiple-item-1' do
              expect(page).to have_field('Y Dimension', with: '8')
              expect(page).to have_field('Unit', with: 'Decimal Degrees')
            end
          end
          within '.horizontal-data-resolution-fields.gridded-range-resolutions' do
            expect(page).to have_field('Minimum X Dimension', with: '9')
            expect(page).to have_field('Maximum X Dimension', with: '10')
            expect(page).to have_field('Unit', with: 'Meters')
          end
          within '.horizontal-data-resolution-fields.generic-resolutions' do
            expect(page).to have_field('X Dimension', with: '11')
            expect(page).to have_field('Unit', with: 'Decimal Degrees')
          end
        end
      end
      expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
    end
  end

  context 'when changing to a set containing horizontal and another type' do
    before do
      select 'Horizontal and Vertical', from: 'Spatial Coverage Type'
    end

    it 'retains the horizontal data' do
      within '.spatial-extent' do
        expect(page).to have_field('Spatial Coverage Type', with: 'HORIZONTAL_VERTICAL')
        # Horizontal
        expect(page).to have_field('Zone Identifier', with: 'Zone ID')
        within '.geometry' do
          expect(page).to have_checked_field('Cartesian')
          expect(page).to have_no_checked_field('Geodetic')
          # BoundingRectangles
          within '.multiple.bounding-rectangles' do
            within '.multiple-item-0' do
              expect(page).to have_field('West', with: '-180.0')
              expect(page).to have_field('North', with: '90.0')
              expect(page).to have_field('East', with: '180.0')
              expect(page).to have_field('South', with: '-90.0')
            end
            within '.multiple-item-1' do
              expect(page).to have_field('West', with: '-96.9284587')
              expect(page).to have_field('North', with: '58.968602')
              expect(page).to have_field('East', with: '-56.9284587')
              expect(page).to have_field('South', with: '18.968602')
            end
          end
        end
        within '.resolution-and-coordinate-system' do
          expect(page).to have_field('Description', with: 'ResolutionAndCoordinateSystem Description')
          expect(page).to have_field('Horizontal Datum Name', with: 'HorizontalDatumName Text')
          expect(page).to have_field('Ellipsoid Name', with: 'EllipsoidName Text')
          expect(page).to have_field('Semi Major Axis', with: '1.0')
          expect(page).to have_field('Denominator Of Flattening Ratio', with: '1.0')
          expect(page).to have_checked_field('Horizontal Data Resolution')
          within '.horizontal-data-resolution' do
            expect(page).to have_checked_field('Point Resolution')
            expect(page).to have_checked_field('Point')

            expect(page).to have_checked_field('Varies Resolution')
            expect(page).to have_checked_field('Varies')

            within '.horizontal-data-resolution-fields.non-gridded-resolutions' do
              expect(page).to have_field('X Dimension', with: '1')
              expect(page).to have_field('Y Dimension', with: '2')
              expect(page).to have_field('Unit', with: 'Meters')
              expect(page).to have_field('Viewing Angle Type', with: 'At Nadir')
              expect(page).to have_field('Scan Direction', with: 'Cross Track')
            end
            within '.horizontal-data-resolution-fields.non-gridded-range-resolutions' do
              expect(page).to have_field('Minimum X Dimension', with: '3')
              expect(page).to have_field('Maximum X Dimension', with: '5')
              expect(page).to have_field('Minimum Y Dimension', with: '4')
              expect(page).to have_field('Maximum Y Dimension', with: '6')
              expect(page).to have_field('Unit', with: 'Meters')
              expect(page).to have_field('Viewing Angle Type', with: 'At Nadir')
              expect(page).to have_field('Scan Direction', with: 'Cross Track')
            end
            within '.horizontal-data-resolution-fields.gridded-resolutions' do
              within '.multiple-item-0' do
                expect(page).to have_field('X Dimension', with: '7')
                expect(page).to have_field('Unit', with: 'Meters')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Y Dimension', with: '8')
                expect(page).to have_field('Unit', with: 'Decimal Degrees')
              end
            end
            within '.horizontal-data-resolution-fields.gridded-range-resolutions' do
              expect(page).to have_field('Minimum X Dimension', with: '9')
              expect(page).to have_field('Maximum X Dimension', with: '10')
              expect(page).to have_field('Unit', with: 'Meters')
            end
            within '.horizontal-data-resolution-fields.generic-resolutions' do
              expect(page).to have_field('X Dimension', with: '11')
              expect(page).to have_field('Unit', with: 'Decimal Degrees')
            end
          end
        end
        # Vertical
        within '.vertical-spatial-domains' do
          expect(page).to have_field('Type', with: '')
          expect(page).to have_field('Value', with: '')
        end
        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end
    end

    context 'after filling in vertical data, switching clears the horizontal data' do
      before do
        within '.vertical-spatial-domains' do
          select 'Atmosphere Layer', from: 'Type'
          fill_in 'Value', with: '1.0'
        end

        # Switching to Vertical should clear the non-vertical spatial extents,
        # so the horizontal fields should be empty and the vertical fields
        # should still be populated
        select 'Vertical', from: 'Spatial Coverage Type'
        select 'Horizontal and Vertical', from: 'Spatial Coverage Type'
      end

      it 'retains the vertical data' do
        within '.vertical-spatial-domains' do
          expect(page).to have_field('Type', with: 'Atmosphere Layer')
          expect(page).to have_field('Value', with: '1.0')
        end
      end

      it 'clears the horizontal data' do
        expect(page).to have_field('Zone Identifier', with: '')
        within '.geometry' do
          expect(page).to have_no_checked_field('Cartesian')
          expect(page).to have_no_checked_field('Geodetic')
          expect(page).to have_no_checked_field('BoundingRectangles')
        end
        within '.resolution-and-coordinate-system' do
          expect(page).to have_field('Description', with: '')
          expect(page).to have_field('Horizontal Datum Name', with: '')
          expect(page).to have_field('Ellipsoid Name', with: '')
          expect(page).to have_field('Semi Major Axis', with: '')
          expect(page).to have_field('Denominator Of Flattening Ratio', with: '')
          expect(page).to have_no_checked_field('Horizontal Data Resolution')
          expect(page).to have_no_checked_field('Local Coordinate System')
        end
      end
    end
  end

  context 'when making a change without selecting a spatial coverage type' do
    before do
      fill_in 'Zone Identifier', with: 'New Text'

      # This save changes the number from the factory (e.g. 1) to a float (1.0)
      within '.nav-top' do
        click_on 'Save'
      end

      click_on 'Expand All'
    end

    it 'saves the change' do
      within '.spatial-extent' do
        expect(page).to have_field('Zone Identifier', with: 'New Text')
      end
    end

    it 'does not populate the spatial coverage type' do
      within '.spatial-extent' do
        expect(page).to have_field('Spatial Coverage Type', with: '')
      end
    end

    it 'saves the rest of the fields' do
      within '.spatial-extent' do
        # Horizontal
        within '.geometry' do
          expect(page).to have_checked_field('Cartesian')
          expect(page).to have_no_checked_field('Geodetic')
          # BoundingRectangles
          within '.multiple.bounding-rectangles' do
            within '.multiple-item-0' do
              expect(page).to have_field('West', with: '-180.0')
              expect(page).to have_field('North', with: '90.0')
              expect(page).to have_field('East', with: '180.0')
              expect(page).to have_field('South', with: '-90.0')
            end
            within '.multiple-item-1' do
              expect(page).to have_field('West', with: '-96.9284587')
              expect(page).to have_field('North', with: '58.968602')
              expect(page).to have_field('East', with: '-56.9284587')
              expect(page).to have_field('South', with: '18.968602')
            end
          end
        end
        within '.resolution-and-coordinate-system' do
          expect(page).to have_field('Description', with: 'ResolutionAndCoordinateSystem Description')
          expect(page).to have_field('Horizontal Datum Name', with: 'HorizontalDatumName Text')
          expect(page).to have_field('Ellipsoid Name', with: 'EllipsoidName Text')
          expect(page).to have_field('Semi Major Axis', with: '1.0')
          expect(page).to have_field('Denominator Of Flattening Ratio', with: '1.0')
          expect(page).to have_checked_field('Horizontal Data Resolution')
          # Horizontal Data Resolution
          within '.horizontal-data-resolution' do
            expect(page).to have_checked_field('Point Resolution')
            expect(page).to have_checked_field('Point')

            expect(page).to have_checked_field('Varies Resolution')
            expect(page).to have_checked_field('Varies')

            within '.horizontal-data-resolution-fields.non-gridded-resolutions' do
              expect(page).to have_field('X Dimension', with: '1.0')
              expect(page).to have_field('Y Dimension', with: '2.0')
              expect(page).to have_field('Unit', with: 'Meters')
              expect(page).to have_field('Viewing Angle Type', with: 'At Nadir')
              expect(page).to have_field('Scan Direction', with: 'Cross Track')
            end
            within '.horizontal-data-resolution-fields.non-gridded-range-resolutions' do
              expect(page).to have_field('Minimum X Dimension', with: '3.0')
              expect(page).to have_field('Maximum X Dimension', with: '5.0')
              expect(page).to have_field('Minimum Y Dimension', with: '4.0')
              expect(page).to have_field('Maximum Y Dimension', with: '6.0')
              expect(page).to have_field('Unit', with: 'Meters')
              expect(page).to have_field('Viewing Angle Type', with: 'At Nadir')
              expect(page).to have_field('Scan Direction', with: 'Cross Track')
            end
            within '.horizontal-data-resolution-fields.gridded-resolutions' do
              within '.multiple-item-0' do
                expect(page).to have_field('X Dimension', with: '7.0')
                expect(page).to have_field('Unit', with: 'Meters')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Y Dimension', with: '8.0')
                expect(page).to have_field('Unit', with: 'Decimal Degrees')
              end
            end
            within '.horizontal-data-resolution-fields.gridded-range-resolutions' do
              expect(page).to have_field('Minimum X Dimension', with: '9.0')
              expect(page).to have_field('Maximum X Dimension', with: '10.0')
              expect(page).to have_field('Unit', with: 'Meters')
            end
            within '.horizontal-data-resolution-fields.generic-resolutions' do
              expect(page).to have_field('X Dimension', with: '11.0')
              expect(page).to have_field('Unit', with: 'Decimal Degrees')
            end
          end
        end
        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end
    end
  end
end
