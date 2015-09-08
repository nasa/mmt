# MMT-290, MMT-297

require 'rails_helper'

describe 'Spatial extent form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form with horizontal spatial' do
    before do
      click_on 'Spatial Extent'

      # Spatial Extent
      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
      fill_in 'Zone Identifier', with: 'Zone ID'
      within '.geometry' do
        choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        add_geometry
      end
      select 'Cartesian', from: 'Granule Spatial Representation'

      # Tiling Identification System
      fill_in 'Tiling Identification System Name', with: 'System name'
      within first('.tiling-coordinate') do
        fill_in 'Minimum Value', with: '-50.0'
        fill_in 'Maximum Value', with: '50.0'
      end
      within all('.tiling-coordinate').last do
        fill_in 'Minimum Value', with: '-30.0'
        fill_in 'Maximum Value', with: '30.0'
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


      # Spatial Keywords
      within '.multiple.spatial-keywords' do
        fill_in 'Spatial Keyword', with: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
        click_on 'Add Another Keyword'
        within all('.multiple-item').last do
          fill_in 'Spatial Keyword', with: 'abdf4d5c-55dc-4324-9ae5-5adf41e99da3'
        end
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page including horizontal spatial data' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it "shows pre-entered values in the draft preview page including horizontal spatial data" do
      expect(page).to have_content('Spatial Coverage Type: Horizontal')
      expect(page).to have_content('Zone Identifier: Zone ID')
      expect(page).to have_content('Coordinate System: Cartesian')
      expect(page).to have_content('Longitude: -77.047878')
      expect(page).to have_content('Latitude: 38.805407')
      expect(page).to have_content('Longitude: -76.9284587')
      expect(page).to have_content('Latitude: 38.968602')
      expect(page).to have_content('Longitude: 0.0')
      expect(page).to have_content('Latitude: 0.0')
      expect(page).to have_content('West Bounding Coordinate: -180.0')
      expect(page).to have_content('North Bounding Coordinate: 90.0')
      expect(page).to have_content('East Bounding Coordinate: 180.0')
      expect(page).to have_content('South Bounding Coordinate: -90.0')
      expect(page).to have_content('West Bounding Coordinate: -96.9284587')
      expect(page).to have_content('North Bounding Coordinate: 58.968602')
      expect(page).to have_content('East Bounding Coordinate: -56.9284587')
      expect(page).to have_content('South Bounding Coordinate: 18.968602')
      expect(page).to have_content('Longitude: 10.0')
      expect(page).to have_content('Latitude: 10.0')
      expect(page).to have_content('Longitude: -10.0')
      expect(page).to have_content('Latitude: -10.0')
      expect(page).to have_content('Longitude: 38.98828125')
      expect(page).to have_content('Latitude: -77.044921875')
      expect(page).to have_content('Longitude: 38.935546875')
      expect(page).to have_content('Latitude: -77.1240234375')
      expect(page).to have_content('Longitude: 38.81689453125')
      expect(page).to have_content('Latitude: -77.02734375')
      expect(page).to have_content('Longitude: 38.900390625')
      expect(page).to have_content('Latitude: -76.9130859375')
      expect(page).to have_content('Longitude: 25.0')
      expect(page).to have_content('Latitude: 25.0')
      expect(page).to have_content('Longitude: 24.0')
      expect(page).to have_content('Latitude: 24.0')
      expect(page).to have_content('Longitude: 26.0')
      expect(page).to have_content('Latitude: 26.0')
      expect(page).to have_content('Granule Spatial Representation: Cartesian')
      expect(page).to have_content('Tiling Identification System Name: System name')
      expect(page).to have_content('Minimum Value: -50.0')
      expect(page).to have_content('Maximum Value: 50.0')
      expect(page).to have_content('Minimum Value: -30.0')
      expect(page).to have_content('Maximum Value: 30.0')
      expect(page).to have_content('Spatial Coverage Type: Horizontal')
      expect(page).to have_content('Horizontal Datum Name: Datum name')
      expect(page).to have_content('Ellipsoid Name: Ellipsoid name')
      expect(page).to have_content('Semi Major Axis: 3.0')
      expect(page).to have_content('Denominator Of Flattening Ratio: 4.0')
      expect(page).to have_content('Geographic Coordinate Units: Coordinate units')
      expect(page).to have_content('Latitude Resolution: 42.0')
      expect(page).to have_content('Longitude Resolution: 43.0')
      expect(page).to have_content('Spatial Keywords: f47ac10b-58cc-4372-a567-0e02b2c3d479 abdf4d5c-55dc-4324-9ae5-5adf41e99da3')

      # Also check side bar
      # Note that handling blank spatial extents is tested in other form tests that don't populate spatial extents
      expect(page).to have_content('Lat: 38.805407')
      expect(page).to have_content('Lon: -77.047878')
      expect(page).to have_content('Lat: 38.968602')
      expect(page).to have_content('Lon: -76.9284587')
      expect(page).to have_content('N: 90')
      expect(page).to have_content('S: -90')
      expect(page).to have_content('E: 180')
      expect(page).to have_content('W: -180')
      expect(page).to have_content('N: 58.968602')
      expect(page).to have_content('S: 18.968602')
      expect(page).to have_content('E: -56.9284587')
      expect(page).to have_content('W: -96.9284587')

      expect(page).to have_content('No Temporal Coverages found')
      expect(page).to_not have_content('No Spatial Coverages found')
    end

    context 'when returning to the form' do
      before do
        click_on 'Spatial Extent'

        open_accordions
      end

      it 'populates the form with the values including horizontal spatial data' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_checked_field('Horizontal')
          expect(page).to have_no_checked_field('Vertical')
          expect(page).to have_no_checked_field('Orbit')
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
            # BoundingRectangles
            within '.multiple.bounding-rectangles' do
              expect(page).to have_field('Longitude', with: '0.0')
              expect(page).to have_field('Latitude', with: '0.0')
              expect(page).to have_field('West Bounding Coordinate', with: '-180.0')
              expect(page).to have_field('North Bounding Coordinate', with: '90.0')
              expect(page).to have_field('East Bounding Coordinate', with: '180.0')
              expect(page).to have_field('South Bounding Coordinate', with: '-90.0')
              within '.multiple-item-1' do
                expect(page).to have_field('West Bounding Coordinate', with: '-96.9284587')
                expect(page).to have_field('North Bounding Coordinate', with: '58.968602')
                expect(page).to have_field('East Bounding Coordinate', with: '-56.9284587')
                expect(page).to have_field('South Bounding Coordinate', with: '18.968602')
              end
            end
            # GPolygons
            within '.multiple.g-polygons > .multiple-item-0' do
              within '.point' do
                expect(page).to have_field('Longitude', with: '0.0')
                expect(page).to have_field('Latitude', with: '0.0')
              end
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
            # Lines
            within '.multiple.lines > .multiple-item-0' do
              within '.point' do
                expect(page).to have_field('Longitude', with: '25.0')
                expect(page).to have_field('Latitude', with: '25.0')
              end
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
              within '.point' do
                expect(page).to have_field('Longitude', with: '25.0')
                expect(page).to have_field('Latitude', with: '25.0')
              end
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

        # Tiling Identification System
        expect(page).to have_field('Tiling Identification System Name', with: 'System name')
        within first('.tiling-coordinate') do
          expect(page).to have_field('Minimum Value', with: '-50.0')
          expect(page).to have_field('Maximum Value', with: '50.0')
        end
        within all('.tiling-coordinate').last do
          expect(page).to have_field('Minimum Value', with: '-30.0')
          expect(page).to have_field('Maximum Value', with: '30.0')
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


        # Spatial Keywords
        within '.multiple.spatial-keywords' do
          expect(page).to have_field('Spatial Keyword', with: 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
          expect(page).to have_field('Spatial Keyword', with: 'abdf4d5c-55dc-4324-9ae5-5adf41e99da3')
        end

      end

    end
  end

  context 'when submitting the form with vertical spatial' do
    before do
      click_on 'Spatial Extent'

      # Spatial Extent
      choose 'draft_spatial_extent_spatial_coverage_type_VERTICAL'
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
        fill_in 'Resolution', with: '3.0'
        click_on 'Add Another Resolution'
        within all('.multiple-item').last do
          fill_in 'Resolution', with: '4.0'
        end
      end
      within all('.vertical-system-definition').last do
        fill_in 'Datum Name', with: 'datum name 1'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method 1'
        fill_in 'Resolution', with: '5.0'
        click_on 'Add Another Resolution'
        within all('.multiple-item').last do
          fill_in 'Resolution', with: '6.0'
        end
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
       # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page including vertical spatial data' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it "shows pre-entered values in the draft preview page" do
      expect(page).to have_content('Spatial Coverage Type: Vertical')
      expect(page).to have_content('domain type', :count=>2)
      expect(page).to have_content('domain type 1')
      expect(page).to have_content('domain value', :count=>2)
      expect(page).to have_content('domain value 1')
      expect(page).to have_content('Granule Spatial Representation: Cartesian')
      expect(page).to have_content('Spatial Coverage Type: Vertical')
      expect(page).to have_content('Datum Name: datum name')
      expect(page).to have_content('Distance Units: miles')
      expect(page).to have_content('Encoding Method: encoding method')
      expect(page).to have_content('Resolutions: 3.0 4.0')

      expect(page).to have_content('Datum Name: datum name 1')
      expect(page).to have_content('Encoding Method: encoding method 1')
      expect(page).to have_content('Resolutions: 5.0 6.0')
    end


    context 'when returning to the form with vertical spatial data' do
      before do
        click_on 'Spatial Extent'

        open_accordions
      end

      it 'populates the form with the values including vertical spatial data' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_no_checked_field('Horizontal')
          expect(page).to have_checked_field('Vertical')
          expect(page).to have_no_checked_field('Orbit')

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
          expect(page).to have_field('Resolution', with: '3.0')
          expect(page).to have_field('Resolution', with: '4.0')
        end
        within all('.vertical-system-definition').last do
          expect(page).to have_field('Datum Name', with: 'datum name 1')
          expect(page).to have_field('Distance Units', with: 'miles')
          expect(page).to have_field('Encoding Method', with: 'encoding method 1')
          expect(page).to have_field('Resolution', with: '5.0')
          expect(page).to have_field('Resolution', with: '6.0')
        end

      end

    end
  end

  context 'when submitting the form with orbital spatial' do
    before do
      click_on 'Spatial Extent'

      # Spatial Extent
      choose 'draft_spatial_extent_spatial_coverage_type_ORBITAL'
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
        fill_in 'Resolution', with: '3.0'
        click_on 'Add Another Resolution'
        within all('.multiple-item').last do
          fill_in 'Resolution', with: '4.0'
        end
      end
      within all('.vertical-system-definition').last do
        fill_in 'Datum Name', with: 'datum name 1'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method 1'
        fill_in 'Resolution', with: '5.0'
        click_on 'Add Another Resolution'
        within all('.multiple-item').last do
          fill_in 'Resolution', with: '6.0'
        end
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
       # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page including orbital spatial data' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it "shows pre-entered values in the draft preview page including orbital spatial data" do
      expect(page).to have_content('Spatial Coverage Type: Orbital')
      expect(page).to have_content('Swath Width: 1.0')
      expect(page).to have_content('Period: 2.0')
      expect(page).to have_content('Inclination Angle: 3.0')
      expect(page).to have_content('Number Of Orbits: 4.0')
      expect(page).to have_content('Start Circular Latitude: 5.0')
      expect(page).to have_content('Granule Spatial Representation: Cartesian')
      expect(page).to have_content('Spatial Coverage Type: Both')
      expect(page).to have_content('Horizontal Datum Name: Datum name')
      expect(page).to have_content('Ellipsoid Name: Ellipsoid name')
      expect(page).to have_content('Semi Major Axis: 3.0')
      expect(page).to have_content('Denominator Of Flattening Ratio: 4.0')
      expect(page).to have_content('Geo Reference Information: reference information')
      expect(page).to have_content('Description: local description')
      expect(page).to have_content('Distance Units: miles')
      expect(page).to have_content('Encoding Method: encoding method')
      expect(page).to have_content('Resolutions: 3.0 4.0')
      expect(page).to have_content('Datum Name: datum name 1')
      expect(page).to have_content('Encoding Method: encoding method 1')
      expect(page).to have_content('Resolutions: 5.0 6.0')
    end

    context 'when returning to the form for orbital spatial data' do
      before do
        click_on 'Spatial Extent'

        open_accordions
      end

      it 'populates the form with the values including orbital spatial data' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_no_checked_field('Horizontal')
          expect(page).to have_no_checked_field('Vertical')
          expect(page).to have_checked_field('Orbit')
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
          expect(page).to have_field('Resolution', with: '3.0')
          expect(page).to have_field('Resolution', with: '4.0')
        end
        within all('.vertical-system-definition').last do
          expect(page).to have_field('Datum Name', with: 'datum name 1')
          expect(page).to have_field('Distance Units', with: 'miles')
          expect(page).to have_field('Encoding Method', with: 'encoding method 1')
          expect(page).to have_field('Resolution', with: '5.0')
          expect(page).to have_field('Resolution', with: '6.0')
        end

      end

    end
  end

end
