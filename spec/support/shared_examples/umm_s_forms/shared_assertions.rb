# Groups of assertions used in UMM-S forms tests

def service_contact_groups_assertions
  within '.multiple.contact-groups > .multiple-item-0' do
    expect(page).to have_select('Roles', selected: ['TECHNICAL CONTACT', 'SCIENCE CONTACT'])
    expect(page).to have_field('Group Name', with: 'Group 1')

    service_contact_information_assertions
  end
  within '.multiple.contact-groups > .multiple-item-1' do
    expect(page).to have_select('Roles', selected: ['SERVICE PROVIDER CONTACT'])
    expect(page).to have_field('Group Name', with: 'Group 2')
  end
end

def service_contact_persons_assertions
  within '.multiple.contact-persons > .multiple-item-0' do
    expect(page).to have_select('Roles', selected: ['SERVICE PROVIDER'])
    expect(page).to have_field('First Name', with: 'First')
    expect(page).to have_field('Middle Name', with: 'Middle')
    expect(page).to have_field('Last Name', with: 'Last')

    service_contact_information_assertions
  end
  within '.multiple.contact-persons > .multiple-item-1' do
    expect(page).to have_select('Roles', selected: ['DEVELOPER'])
    expect(page).to have_field('Last Name', with: 'Last 2')
  end
end

def service_contact_information_assertions
  within all('.contact-information').first do
    expect(page).to have_field('Service Hours', with: '9-6, M-F')
    expect(page).to have_field('Contact Instruction', with: 'Email only')

    within '.multiple.contact-mechanisms' do
      within '.multiple-item-0' do
        expect(page).to have_field('Type', with: 'Email')
        expect(page).to have_field('Value', with: 'example@example.com')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Type', with: 'Email')
        expect(page).to have_field('Value', with: 'example2@example.com')
      end
    end

    within '.multiple.addresses > .multiple-item-0' do
      within '.multiple.street-addresses' do
        within '.multiple-item-0' do
          expect(page).to have_selector('input[value="300 E Street Southwest"]')
        end
        within '.multiple-item-1' do
          expect(page).to have_selector('input[value="Room 203"]')
        end
        within '.multiple-item-2' do
          expect(page).to have_selector('input[value="Address line 3"]')
        end
      end
      expect(page).to have_field('City', with: 'Washington')
      expect(page).to have_field('State / Province', with: 'DC')
      expect(page).to have_field('Postal Code', with: '20546')
      expect(page).to have_field('Country', with: 'United States')
    end

    within '.multiple.addresses > .multiple-item-1' do
      within '.multiple.street-addresses' do
        within '.multiple-item-0' do
          expect(page).to have_selector('input[value="8800 Greenbelt Road"]')
        end
      end
      expect(page).to have_field('City', with: 'Greenbelt')
      expect(page).to have_field('State / Province', with: 'MD')
      expect(page).to have_field('Postal Code', with: '20771')
      expect(page).to have_field('Country', with: 'United States')
    end


    within '.multiple.online-resources > .multiple-item-0' do
      expect(page).to have_field('Name', with: 'ORN1 Text')
      expect(page).to have_field('Protocol', with: 'ORP1 Text')
      expect(page).to have_field('Linkage', with: 'ORL1 Text')
      expect(page).to have_field('Description', with: 'ORD1 Text')
      expect(page).to have_field('Application Profile', with: 'ORAP1 Text')
      expect(page).to have_field('Function', with: 'ORF1 Text')
    end
    within '.multiple.online-resources > .multiple-item-1' do
      expect(page).to have_field('Name', with: 'ORN2 Text')
      expect(page).to have_field('Protocol', with: 'ORP2 Text')
      expect(page).to have_field('Linkage', with: 'ORL2 Text')
      expect(page).to have_field('Description', with: 'ORD2 Text')
      expect(page).to have_field('Application Profile', with: 'ORAP2 Text')
      expect(page).to have_field('Function', with: 'ORF2 Text')
    end
    within '.multiple.online-resources > .multiple-item-2' do
      expect(page).to have_field('Name', with: 'ORN3 Text')
      expect(page).to have_field('Description', with: 'ORD3 Text')
      expect(page).to have_field('Linkage', with: 'ORL3 Text')
    end
  end
end

# Operation Metadata form

def operation_metadata_assertions
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

def operation_metadata_spatial_points_assertions
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
end

def operation_metadata_spatial_line_strings_assertions
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
end

def operation_metadata_spatial_bounding_box_assertions
  expect(page).to have_field('Data Resource Spatial Type', with: 'BOUNDING_BOX')
  expect(page).to have_field('CRS Identifier', with: 'EPSG:3408')
  expect(page).to have_field('West Bounding Coordinate', with: '-5.0')
  expect(page).to have_field('East Bounding Coordinate', with: '5.0')
  expect(page).to have_field('South Bounding Coordinate', with: '-10.0')
  expect(page).to have_field('North Bounding Coordinate', with: '10.0')
end

def operation_metadata_spatial_polygons_assertions
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
end

def operation_metadata_general_grid_assertions
  expect(page).to have_field('Data Resource Spatial Type', with: 'GENERAL_GRID')
  within '.data-resource-spatial-extent.general-grid' do
    expect(page).to have_field('CRS Identifier', with: 'EPSG:26917')

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
end
