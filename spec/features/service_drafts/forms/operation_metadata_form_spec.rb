describe 'Service Operation Metadata Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'operation_metadata')
  end

  context 'when submitting the form with spatial points' do
    before do
      select 'DescribeCoverage', from: 'Operation Name'
      fill_in 'Operation Description', with: 'The DescribeCoverage operation description...'
      select 'XML', from: 'Distributed Computing Platform'
      select 'WEBSERVICES', from: 'Distributed Computing Platform'
      fill_in 'Invocation Name', with: 'SOME DAAC WCS Server'

      fill_in 'Resource Name', with: '1286_2'
      fill_in 'Resource Linkage', with: 'https://webmap.some.gov/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0'
      fill_in 'Resource Description', with: 'Vegetation classes mapped to LIDAR-derived canopy structure classes in 30-meter, Great Smoky Mountains National Park, 2011'

      fill_in 'Operation Chain Name', with: 'Some Op Chain for Smoky Mountains'
      fill_in 'Operation Chain Description', with: 'Some Op Chain description for Smoky Mountains 30-meter 2011'

      fill_in 'Scoped Name', with: '1286_2'
      fill_in 'Data Resource DOI', with: 'https://doi.org/10.3334/SOMEDAAC/1286'
      fill_in 'Data Resource Identifier', with: 'GreatSmokyMountainsNationalPark'
      select 'Map', from: 'Data Resource Source Type'

      select 'SPATIAL_POINT', from: 'Data Resource Spatial Type'
      within '.multiple.spatial-points' do
        within '.multiple-item-0' do
          fill_in 'Latitude', with: '0'
          fill_in 'Longitude', with: '0'
        end
        click_on 'Add another Spatial Point'

        within '.multiple-item-1' do
          fill_in 'Latitude', with: '50'
          fill_in 'Longitude', with: '50'
        end
      end
      fill_in 'Spatial Resolution', with: '30'
      select 'Meters', from: 'Spatial Resolution Unit'

      select 'TIME_STAMP', from: 'Data Resource Temporal Type'
      within '.multiple.data-resource-time-points' do
        fill_in 'Time Format', with: '%Y%M%D'
        fill_in 'Time Value', with: '2009-01-08'
        fill_in 'Description', with: 'Time stamp of the granule within the collection'
        click_on 'Add another Data Resource Time Point'

        within '.multiple-item-1' do
          fill_in 'Time Format', with: '%Y'
          fill_in 'Time Value', with: '2011'
          fill_in 'Description', with: 'Time stamp of the layer'
        end
      end
      fill_in 'Temporal Resolution', with: '1'
      select 'YEAR', from: 'Temporal Resolution Unit'
      fill_in 'Relative Path', with: '/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0'

      select 'MIXED', from: 'Coupling Type'

      within '.multiple.parameters' do
        within '.multiple-item-0' do
          fill_in 'Parameter Name', with: 'parameter 1'
          fill_in 'Parameter Description', with: 'parameter 1 description'
          fill_in 'Parameter Direction', with: 'abc direction'
          fill_in 'Parameter Optionality', with: 'optional'
          fill_in 'Parameter Repeatability', with: 'some'
        end
        click_on 'Add another Parameter'

        within '.multiple-item-1' do
          fill_in 'Parameter Name', with: 'parameter 2'
          fill_in 'Parameter Description', with: 'parameter 2 description'
          fill_in 'Parameter Direction', with: 'xyz direction'
          fill_in 'Parameter Optionality', with: 'optional'
          fill_in 'Parameter Repeatability', with: 'some'
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'does not display required icons for accordions in Operation Metadata section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    context 'when viewing the form' do
      include_examples 'Operation Metadata Form with Spatial Points'
    end

    context 'when adding spatial line strings' do
      before do
        select 'SPATIAL_LINE_STRING', from: 'Data Resource Spatial Type'

        within '.multiple.spatial-line-strings' do
          within '.multiple-item-0' do
            within '.start-point' do
              fill_in 'Latitude', with: '0'
              fill_in 'Longitude', with: '0'
            end
            within '.end-point' do
              fill_in 'Latitude', with: '10'
              fill_in 'Longitude', with: '10'
            end
          end
          click_on 'Add another Spatial Line String'
          within '.multiple-item-1' do
            within '.start-point' do
              fill_in 'Latitude', with: '20'
              fill_in 'Longitude', with: '20'
            end
            within '.end-point' do
              fill_in 'Latitude', with: '25'
              fill_in 'Longitude', with: '25'
            end
          end
        end

        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Service Draft Updated Successfully!')
      end

      context 'when viewing the form' do
        include_examples 'Operation Metadata Form with Spatial Ling Strings'
      end
    end

    context 'when adding a spatial bounding box' do
      before do
        select 'BOUNDING_BOX', from: 'Data Resource Spatial Type'

        select '3408', from: 'CRS Identifier'
        fill_in 'West Bounding Coordinate', with: '-5'
        fill_in 'East Bounding Coordinate', with: '5'
        fill_in 'South Bounding Coordinate', with: '-10'
        fill_in 'North Bounding Coordinate', with: '10'

        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Service Draft Updated Successfully!')
      end

      context 'when viewing the form' do
        include_examples 'Operation Metadata Form with a Spatial Bounding Box'
      end
    end

    context 'when adding spatial polygons' do
      before do
        select 'SPATIAL_POLYGON', from: 'Data Resource Spatial Type'

        within '.multiple.spatial-polygons' do
          within '.multiple-item-0' do
            fill_in 'Latitude', with: '0'
            fill_in 'Longitude', with: '0'
          end
          click_on 'Add another Point'
          within '.multiple-item-1' do
            fill_in 'Latitude', with: '10'
            fill_in 'Longitude', with: '10'
          end
          click_on 'Add another Point'
          within '.multiple-item-2' do
            fill_in 'Latitude', with: '10'
            fill_in 'Longitude', with: '-10'
          end
          click_on 'Add another Point'
          within '.multiple-item-3' do
            fill_in 'Latitude', with: '-10'
            fill_in 'Longitude', with: '-10'
          end
        end

        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Service Draft Updated Successfully!')
      end

      context 'when viewing the form' do
        include_examples 'Operation Metadata Form with Spatial Polygons'
      end
    end

    context 'when adding a general grid' do
      before do
        select 'GENERAL_GRID', from: 'Data Resource Spatial Type'

        within '.data-resource-spatial-extent.general-grid' do
          select '26917', from: 'CRS Identifier'

          within '.multiple.axes' do
            within '.multiple-item-0' do
              fill_in 'Axis Label', with: 'x'
              fill_in 'Grid Resolution', with: '30.0'
              fill_in 'Extent Label', with: 'axis 1 extent label'
              fill_in 'Lower Bound', with: '0.0'
              fill_in 'Upper Bound', with: '2918.0'
              fill_in 'UOM Label', with: 'Meters'
            end
            click_on 'Add another Axis'

            within '.multiple-item-1' do
              fill_in 'Axis Label', with: 'y'
              fill_in 'Grid Resolution', with: '30.0'
              fill_in 'Extent Label', with: 'axis 2 extent label'
              fill_in 'Lower Bound', with: '0.0'
              fill_in 'Upper Bound', with: '1340.0'
              fill_in 'UOM Label', with: 'Meters'
            end
          end
        end

        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Service Draft Updated Successfully!')
      end

      context 'when viewing the form' do
        include_examples 'Operation Metadata Form with General Grid'
      end
    end
  end
end
