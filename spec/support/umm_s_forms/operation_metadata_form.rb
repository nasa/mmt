shared_examples_for 'Operation Metadata Form with General Grid' do
  it 'displays the form with values including general grid' do
    expect(page).to have_field('Operation Name', with: 'DescribeCoverage')
    expect(page).to have_field('Operation Description', with: 'The DescribeCoverage operation description...')
    expect(page).to have_select('Distributed Computing Platform', selected: ['XML','WEBSERVICES'])
    expect(page).to have_field('Invocation Name', with: 'SOME DAAC WCS Server')

    expect(page).to have_field('Resource Name', with: '1286_2')
    expect(page).to have_field('Resource Linkage', with: 'https://webmap.some.gov/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Resource Description', with: 'Vegetation classes mapped to LIDAR-derived canopy structure classes in 30-meter, Great Smoky Mountains National Park, 2011')

    expect(page).to have_field('Operation Chain Name', with: 'Some Op Chain for Smoky Mountains')
    expect(page).to have_field('Operation Chain Description', with: 'Some Op Chain description for Smoky Mountains 30-meter 2011')

    expect(page).to have_field('Scoped Name', with: '1286_2')
    expect(page).to have_field('Data Resource DOI', with: 'https://doi.org/10.3334/SOMEDAAC/1286')

    expect(page).to have_field('Data Resource Identifier', with: 'GreatSmokyMountainsNationalPark')
    expect(page).to have_field('Data Resource Source Type', with: 'Map')

    expect(page).to have_field('Data Resource Spatial Type', with: 'GENERAL_GRID')
    within '.data-resource-spatial-extent.general-grid' do
      expect(page).to have_field('CRS Identifier', with: '26917')

      within '.multiple.axes' do
        within '.multiple-item-0' do
          expect(page).to have_field('Axis Label', with: 'x')
          expect(page).to have_field('Grid Resolution', with: '30.0')
          expect(page).to have_field('Extent Label', with: 'axis 1 extent label')
          expect(page).to have_field('Lower Bound', with: '0.0')
          expect(page).to have_field('Upper Bound', with: '2918.0')
          expect(page).to have_field('UOM Label', with: 'Meters')
        end
        within '.multiple-item-1' do
          expect(page).to have_field('Axis Label', with: 'y')
          expect(page).to have_field('Grid Resolution', with: '30.0')
          expect(page).to have_field('Extent Label', with: 'axis 2 extent label')
          expect(page).to have_field('Lower Bound', with: '0.0')
          expect(page).to have_field('Upper Bound', with: '1340.0')
          expect(page).to have_field('UOM Label', with: 'Meters')
        end
      end
    end
    expect(page).to have_field('Spatial Resolution', with: '30.0')
    expect(page).to have_field('Spatial Resolution Unit', with: 'Meters')

    expect(page).to have_field('Data Resource Temporal Type', with: 'TIME_STAMP')
    within '.multiple.data-resource-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: '%Y%M%D')
        expect(page).to have_field('Time Value', with: '2009-01-08')
        expect(page).to have_field('Description', with: 'Time stamp of the granule within the collection')
      end

      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: '%Y')
        expect(page).to have_field('Time Value', with: '2011')
        expect(page).to have_field('Description', with: 'Time stamp of the layer')
      end
    end
    expect(page).to have_field('Temporal Resolution', with: '1.0')
    expect(page).to have_field('Temporal Resolution Unit', with: 'YEAR')
    expect(page).to have_field('Relative Path', with: '/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Coupling Type', with: 'MIXED')

    within '.multiple.parameters' do
      within '.multiple-item-0' do
        expect(page).to have_field('Parameter Name', with: 'parameter 1')
        expect(page).to have_field('Parameter Description', with: 'parameter 1 description')
        expect(page).to have_field('Parameter Direction', with: 'abc direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Parameter Name', with: 'parameter 2')
        expect(page).to have_field('Parameter Description', with: 'parameter 2 description')
        expect(page).to have_field('Parameter Direction', with: 'xyz direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
    end
  end
end

shared_examples_for 'Operation Metadata Form with Spatial Points' do
  it 'displays the form with values including spatial points' do
    expect(page).to have_field('Operation Name', with: 'DescribeCoverage')
    expect(page).to have_field('Operation Description', with: 'The DescribeCoverage operation description...')
    expect(page).to have_select('Distributed Computing Platform', selected: ['XML','WEBSERVICES'])
    expect(page).to have_field('Invocation Name', with: 'SOME DAAC WCS Server')

    expect(page).to have_field('Resource Name', with: '1286_2')
    expect(page).to have_field('Resource Linkage', with: 'https://webmap.some.gov/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Resource Description', with: 'Vegetation classes mapped to LIDAR-derived canopy structure classes in 30-meter, Great Smoky Mountains National Park, 2011')

    expect(page).to have_field('Operation Chain Name', with: 'Some Op Chain for Smoky Mountains')
    expect(page).to have_field('Operation Chain Description', with: 'Some Op Chain description for Smoky Mountains 30-meter 2011')

    expect(page).to have_field('Scoped Name', with: '1286_2')
    expect(page).to have_field('Data Resource DOI', with: 'https://doi.org/10.3334/SOMEDAAC/1286')
    expect(page).to have_field('Data Resource Identifier', with: 'GreatSmokyMountainsNationalPark')

    expect(page).to have_field('Data Resource Source Type', with: 'Map')

    expect(page).to have_field('Data Resource Spatial Type', with: 'SPATIAL_POINT')
    within '.multiple.spatial-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Latitude', with: '0.0')
        expect(page).to have_field('Longitude', with: '0.0')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Latitude', with: '50.0')
        expect(page).to have_field('Longitude', with: '50.0')
      end
    end
    expect(page).to have_field('Spatial Resolution', with: '30.0')
    expect(page).to have_field('Spatial Resolution Unit', with: 'Meters')

    expect(page).to have_field('Data Resource Temporal Type', with: 'TIME_STAMP')
    within '.multiple.data-resource-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: '%Y%M%D')
        expect(page).to have_field('Time Value', with: '2009-01-08')
        expect(page).to have_field('Description', with: 'Time stamp of the granule within the collection')
      end

      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: '%Y')
        expect(page).to have_field('Time Value', with: '2011')
        expect(page).to have_field('Description', with: 'Time stamp of the layer')
      end
    end
    expect(page).to have_field('Temporal Resolution', with: '1.0')
    expect(page).to have_field('Temporal Resolution Unit', with: 'YEAR')
    expect(page).to have_field('Relative Path', with: '/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Coupling Type', with: 'MIXED')

    within '.multiple.parameters' do
      within '.multiple-item-0' do
        expect(page).to have_field('Parameter Name', with: 'parameter 1')
        expect(page).to have_field('Parameter Description', with: 'parameter 1 description')
        expect(page).to have_field('Parameter Direction', with: 'abc direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Parameter Name', with: 'parameter 2')
        expect(page).to have_field('Parameter Description', with: 'parameter 2 description')
        expect(page).to have_field('Parameter Direction', with: 'xyz direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
    end
  end
end

shared_examples_for 'Operation Metadata Form with Spatial Ling Strings' do
  it 'displays the form with values including spatial line strings' do
    expect(page).to have_field('Operation Name', with: 'DescribeCoverage')
    expect(page).to have_field('Operation Description', with: 'The DescribeCoverage operation description...')
    expect(page).to have_select('Distributed Computing Platform', selected: ['XML','WEBSERVICES'])
    expect(page).to have_field('Invocation Name', with: 'SOME DAAC WCS Server')

    expect(page).to have_field('Resource Name', with: '1286_2')
    expect(page).to have_field('Resource Linkage', with: 'https://webmap.some.gov/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Resource Description', with: 'Vegetation classes mapped to LIDAR-derived canopy structure classes in 30-meter, Great Smoky Mountains National Park, 2011')

    expect(page).to have_field('Operation Chain Name', with: 'Some Op Chain for Smoky Mountains')
    expect(page).to have_field('Operation Chain Description', with: 'Some Op Chain description for Smoky Mountains 30-meter 2011')

    expect(page).to have_field('Scoped Name', with: '1286_2')
    expect(page).to have_field('Data Resource DOI', with: 'https://doi.org/10.3334/SOMEDAAC/1286')
    expect(page).to have_field('Data Resource Identifier', with: 'GreatSmokyMountainsNationalPark')

    expect(page).to have_field('Data Resource Source Type', with: 'Map')

    expect(page).to have_field('Data Resource Spatial Type', with: 'SPATIAL_LINE_STRING')
    within '.multiple.spatial-line-strings' do
      within '.multiple-item-0' do
        within '.start-point' do
          expect(page).to have_field('Latitude', with: '0.0')
          expect(page).to have_field('Longitude', with: '0.0')
        end
        within '.end-point' do
          expect(page).to have_field('Latitude', with: '10.0')
          expect(page).to have_field('Longitude', with: '10.0')
        end
      end
      within '.multiple-item-1' do
        within '.start-point' do
          expect(page).to have_field('Latitude', with: '20.0')
          expect(page).to have_field('Longitude', with: '20.0')
        end
        within '.end-point' do
          expect(page).to have_field('Latitude', with: '25.0')
          expect(page).to have_field('Longitude', with: '25.0')
        end
      end
    end
    expect(page).to have_field('Spatial Resolution', with: '30.0')
    expect(page).to have_field('Spatial Resolution Unit', with: 'Meters')

    expect(page).to have_field('Data Resource Temporal Type', with: 'TIME_STAMP')
    within '.multiple.data-resource-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: '%Y%M%D')
        expect(page).to have_field('Time Value', with: '2009-01-08')
        expect(page).to have_field('Description', with: 'Time stamp of the granule within the collection')
      end

      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: '%Y')
        expect(page).to have_field('Time Value', with: '2011')
        expect(page).to have_field('Description', with: 'Time stamp of the layer')
      end
    end
    expect(page).to have_field('Temporal Resolution', with: '1.0')
    expect(page).to have_field('Temporal Resolution Unit', with: 'YEAR')
    expect(page).to have_field('Relative Path', with: '/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Coupling Type', with: 'MIXED')

    within '.multiple.parameters' do
      within '.multiple-item-0' do
        expect(page).to have_field('Parameter Name', with: 'parameter 1')
        expect(page).to have_field('Parameter Description', with: 'parameter 1 description')
        expect(page).to have_field('Parameter Direction', with: 'abc direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Parameter Name', with: 'parameter 2')
        expect(page).to have_field('Parameter Description', with: 'parameter 2 description')
        expect(page).to have_field('Parameter Direction', with: 'xyz direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
    end
  end
end

shared_examples_for 'Operation Metadata Form with a Spatial Bounding Box' do
  it 'displays the form with values including spatial bounding box' do
    expect(page).to have_field('Operation Name', with: 'DescribeCoverage')
    expect(page).to have_field('Operation Description', with: 'The DescribeCoverage operation description...')
    expect(page).to have_select('Distributed Computing Platform', selected: ['XML','WEBSERVICES'])
    expect(page).to have_field('Invocation Name', with: 'SOME DAAC WCS Server')

    expect(page).to have_field('Resource Name', with: '1286_2')
    expect(page).to have_field('Resource Linkage', with: 'https://webmap.some.gov/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Resource Description', with: 'Vegetation classes mapped to LIDAR-derived canopy structure classes in 30-meter, Great Smoky Mountains National Park, 2011')

    expect(page).to have_field('Operation Chain Name', with: 'Some Op Chain for Smoky Mountains')
    expect(page).to have_field('Operation Chain Description', with: 'Some Op Chain description for Smoky Mountains 30-meter 2011')

    expect(page).to have_field('Scoped Name', with: '1286_2')
    expect(page).to have_field('Data Resource DOI', with: 'https://doi.org/10.3334/SOMEDAAC/1286')
    expect(page).to have_field('Data Resource Identifier', with: 'GreatSmokyMountainsNationalPark')

    expect(page).to have_field('Data Resource Source Type', with: 'Map')

    expect(page).to have_field('Data Resource Spatial Type', with: 'BOUNDING_BOX')
    expect(page).to have_field('CRS Identifier', with: '3408')
    expect(page).to have_field('West Bounding Coordinate', with: '-5.0')
    expect(page).to have_field('East Bounding Coordinate', with: '5.0')
    expect(page).to have_field('South Bounding Coordinate', with: '-10.0')
    expect(page).to have_field('North Bounding Coordinate', with: '10.0')
    expect(page).to have_field('Spatial Resolution', with: '30.0')
    expect(page).to have_field('Spatial Resolution Unit', with: 'Meters')

    expect(page).to have_field('Data Resource Temporal Type', with: 'TIME_STAMP')
    within '.multiple.data-resource-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: '%Y%M%D')
        expect(page).to have_field('Time Value', with: '2009-01-08')
        expect(page).to have_field('Description', with: 'Time stamp of the granule within the collection')
      end

      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: '%Y')
        expect(page).to have_field('Time Value', with: '2011')
        expect(page).to have_field('Description', with: 'Time stamp of the layer')
      end
    end
    expect(page).to have_field('Temporal Resolution', with: '1.0')
    expect(page).to have_field('Temporal Resolution Unit', with: 'YEAR')
    expect(page).to have_field('Relative Path', with: '/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Coupling Type', with: 'MIXED')

    within '.multiple.parameters' do
      within '.multiple-item-0' do
        expect(page).to have_field('Parameter Name', with: 'parameter 1')
        expect(page).to have_field('Parameter Description', with: 'parameter 1 description')
        expect(page).to have_field('Parameter Direction', with: 'abc direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Parameter Name', with: 'parameter 2')
        expect(page).to have_field('Parameter Description', with: 'parameter 2 description')
        expect(page).to have_field('Parameter Direction', with: 'xyz direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
    end
  end
end

shared_examples_for 'Operation Metadata Form with Spatial Polygons' do
  it 'displays the form with values including spatial polygons' do
    expect(page).to have_field('Operation Name', with: 'DescribeCoverage')
    expect(page).to have_field('Operation Description', with: 'The DescribeCoverage operation description...')
    expect(page).to have_select('Distributed Computing Platform', selected: ['XML','WEBSERVICES'])
    expect(page).to have_field('Invocation Name', with: 'SOME DAAC WCS Server')

    expect(page).to have_field('Resource Name', with: '1286_2')
    expect(page).to have_field('Resource Linkage', with: 'https://webmap.some.gov/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Resource Description', with: 'Vegetation classes mapped to LIDAR-derived canopy structure classes in 30-meter, Great Smoky Mountains National Park, 2011')

    expect(page).to have_field('Operation Chain Name', with: 'Some Op Chain for Smoky Mountains')
    expect(page).to have_field('Operation Chain Description', with: 'Some Op Chain description for Smoky Mountains 30-meter 2011')

    expect(page).to have_field('Scoped Name', with: '1286_2')
    expect(page).to have_field('Data Resource DOI', with: 'https://doi.org/10.3334/SOMEDAAC/1286')
    expect(page).to have_field('Data Resource Identifier', with: 'GreatSmokyMountainsNationalPark')

    expect(page).to have_field('Data Resource Source Type', with: 'Map')

    expect(page).to have_field('Data Resource Spatial Type', with: 'SPATIAL_POLYGON')
    within '.multiple.spatial-polygons' do
      within '.multiple-item-0' do
        expect(page).to have_field('Latitude', with: '0.0')
        expect(page).to have_field('Longitude', with: '0.0')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Latitude', with: '10.0')
        expect(page).to have_field('Longitude', with: '10.0')
      end
      within '.multiple-item-2' do
        expect(page).to have_field('Latitude', with: '10.0')
        expect(page).to have_field('Longitude', with: '-10.0')
      end
      within '.multiple-item-3' do
        expect(page).to have_field('Latitude', with: '-10.0')
        expect(page).to have_field('Longitude', with: '-10.0')
      end
    end
    expect(page).to have_field('Spatial Resolution', with: '30.0')
    expect(page).to have_field('Spatial Resolution Unit', with: 'Meters')

    expect(page).to have_field('Data Resource Temporal Type', with: 'TIME_STAMP')
    within '.multiple.data-resource-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: '%Y%M%D')
        expect(page).to have_field('Time Value', with: '2009-01-08')
        expect(page).to have_field('Description', with: 'Time stamp of the granule within the collection')
      end

      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: '%Y')
        expect(page).to have_field('Time Value', with: '2011')
        expect(page).to have_field('Description', with: 'Time stamp of the layer')
      end
    end
    expect(page).to have_field('Temporal Resolution', with: '1.0')
    expect(page).to have_field('Temporal Resolution Unit', with: 'YEAR')
    expect(page).to have_field('Relative Path', with: '/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0')
    expect(page).to have_field('Coupling Type', with: 'MIXED')

    within '.multiple.parameters' do
      within '.multiple-item-0' do
        expect(page).to have_field('Parameter Name', with: 'parameter 1')
        expect(page).to have_field('Parameter Description', with: 'parameter 1 description')
        expect(page).to have_field('Parameter Direction', with: 'abc direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Parameter Name', with: 'parameter 2')
        expect(page).to have_field('Parameter Description', with: 'parameter 2 description')
        expect(page).to have_field('Parameter Direction', with: 'xyz direction')
        expect(page).to have_field('Parameter Optionality', with: 'optional')
        expect(page).to have_field('Parameter Repeatability', with: 'some')
      end
    end
  end
end
