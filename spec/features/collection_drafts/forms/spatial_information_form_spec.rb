# MMT-290, MMT-297

require 'rails_helper'

describe 'Spatial information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
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

        # Tiling Identification System
        within '.multiple.tiling-identification-systems' do
          fill_in 'Tiling Identification System Name', with: 'System name'
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
            fill_in 'Tiling Identification System Name', with: 'System name 1'
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

        # Spatial Representation Information
        choose 'draft_spatial_information_spatial_coverage_type_HORIZONTAL'
        fill_in 'Horizontal Datum Name', with: 'Datum name'
        fill_in 'Ellipsoid Name', with: 'Ellipsoid name'
        fill_in 'Semi Major Axis', with: '3.0'
        fill_in 'Denominator Of Flattening Ratio', with: '4.0'

        find('.coordinate-system-picker.geographic').click
        fill_in 'Geographic Coordinate Units', with: 'Coordinate units'
        fill_in 'Latitude Resolution', with: '42.0'
        fill_in 'Longitude Resolution', with: '43.0'

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
          expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
        end

        # Tiling Identification System
        within '.multiple.tiling-identification-systems' do
          within '.multiple-item-0' do
            expect(page).to have_field('Tiling Identification System Name', with: 'System name')
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
            expect(page).to have_field('Tiling Identification System Name', with: 'System name 1')
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

        # Spatial Representation Information
        expect(page).to have_checked_field('Horizontal')
        expect(page).to have_no_checked_field('Vertical')
        expect(page).to have_no_checked_field('Both')

        expect(page).to have_field('Horizontal Datum Name', with: 'Datum name')
        expect(page).to have_field('Ellipsoid Name', with: 'Ellipsoid name')
        expect(page).to have_field('Semi Major Axis', with: '3.0')
        expect(page).to have_field('Denominator Of Flattening Ratio', with: '4.0')
        expect(page).to have_checked_field('Geographic Coordinate System')
        expect(page).to have_field('Geographic Coordinate Units', with: 'Coordinate units')
        expect(page).to have_field('Latitude Resolution', with: '42.0')
        expect(page).to have_field('Longitude Resolution', with: '43.0')

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
        fill_in 'Type', with: 'domain type'
        fill_in 'Value', with: 'domain value'
        click_on 'Add another Vertical Spatial Domain'
        within '.multiple-item-1' do
          fill_in 'Type', with: 'domain type 1'
          fill_in 'Value', with: 'domain value 1'
        end
      end
      select 'Cartesian', from: 'Granule Spatial Representation'

      # Spatial Representation Information
      choose 'draft_spatial_information_spatial_coverage_type_VERTICAL'
      within first('.vertical-system-definition') do
        fill_in 'Datum Name', with: 'datum name'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method'
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
      within all('.vertical-system-definition').last do
        fill_in 'Datum Name', with: 'datum name 1'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method 1'
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
          expect(page).to have_field('Type', with: 'domain type')
          expect(page).to have_field('Value', with: 'domain value')
          expect(page).to have_field('Type', with: 'domain type 1')
          expect(page).to have_field('Value', with: 'domain value 1')
        end
        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end

      # Spatial Representation Information
      expect(page).to have_no_checked_field('Horizontal')
      expect(page).to have_checked_field('Vertical')
      expect(page).to have_no_checked_field('Both')
      within first('.vertical-system-definition') do
        expect(page).to have_field('Datum Name', with: 'datum name')
        expect(page).to have_field('Distance Units', with: 'miles')
        expect(page).to have_field('Encoding Method', with: 'encoding method')
        expect(page).to have_selector('input.resolution[value="3.0"]')
        expect(page).to have_selector('input.resolution[value="4.0"]')
      end
      within all('.vertical-system-definition').last do
        expect(page).to have_field('Datum Name', with: 'datum name 1')
        expect(page).to have_field('Distance Units', with: 'miles')
        expect(page).to have_field('Encoding Method', with: 'encoding method 1')
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
      choose 'draft_spatial_information_spatial_coverage_type_BOTH'
      fill_in 'Horizontal Datum Name', with: 'Datum name'
      fill_in 'Ellipsoid Name', with: 'Ellipsoid name'
      fill_in 'Semi Major Axis', with: '3'
      fill_in 'Denominator Of Flattening Ratio', with: '4'
      find('.coordinate-system-picker.local').click
      fill_in 'Geo Reference Information', with: 'reference information'
      fill_in 'Description', with: 'local description'

      within first('.vertical-system-definition') do
        fill_in 'Datum Name', with: 'datum name'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method'
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
      within all('.vertical-system-definition').last do
        fill_in 'Datum Name', with: 'datum name 1'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method 1'
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
      expect(page).to have_no_checked_field('Horizontal')
      expect(page).to have_no_checked_field('Vertical')
      expect(page).to have_checked_field('Both')
      expect(page).to have_field('Horizontal Datum Name', with: 'Datum name')
      expect(page).to have_field('Ellipsoid Name', with: 'Ellipsoid name')
      expect(page).to have_field('Semi Major Axis', with: '3.0')
      expect(page).to have_field('Denominator Of Flattening Ratio', with: '4.0')
      expect(page).to have_checked_field('Local Coordinate System')
      expect(page).to have_field('Geo Reference Information', with: 'reference information')
      expect(page).to have_field('Description', with: 'local description')

      within first('.vertical-system-definition') do
        expect(page).to have_field('Datum Name', with: 'datum name')
        expect(page).to have_field('Distance Units', with: 'miles')
        expect(page).to have_field('Encoding Method', with: 'encoding method')
        expect(page).to have_selector('input.resolution[value="3.0"]')
        expect(page).to have_selector('input.resolution[value="4.0"]')
      end
      within all('.vertical-system-definition').last do
        expect(page).to have_field('Datum Name', with: 'datum name 1')
        expect(page).to have_field('Distance Units', with: 'miles')
        expect(page).to have_field('Encoding Method', with: 'encoding method 1')
        expect(page).to have_selector('input.resolution[value="5.0"]')
        expect(page).to have_selector('input.resolution[value="6.0"]')
      end
    end
  end

  context 'when submitting the form with horizontal and vertial spatial' do
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
        fill_in 'Type', with: 'domain type'
        fill_in 'Value', with: 'domain value'
        click_on 'Add another Vertical Spatial Domain'
        within '.multiple-item-1' do
          fill_in 'Type', with: 'domain type 1'
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
          expect(page).to have_field('Type', with: 'domain type')
          expect(page).to have_field('Value', with: 'domain value')
          expect(page).to have_field('Type', with: 'domain type 1')
          expect(page).to have_field('Value', with: 'domain value 1')
        end

        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end
    end
  end

  context 'when submitting the form with orbital and vertial spatial' do
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
        fill_in 'Type', with: 'domain type'
        fill_in 'Value', with: 'domain value'
        click_on 'Add another Vertical Spatial Domain'
        within '.multiple-item-1' do
          fill_in 'Type', with: 'domain type 1'
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
          expect(page).to have_field('Type', with: 'domain type')
          expect(page).to have_field('Value', with: 'domain value')
          expect(page).to have_field('Type', with: 'domain type 1')
          expect(page).to have_field('Value', with: 'domain value 1')
        end

        expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
      end
    end
  end
end
