shared_examples_for 'Options Form' do
  it 'displays the form with values' do

    expect(page).to have_checked_field('Subset')
    within '.subset' do
      expect(page).to have_checked_field('Spatial Subset')
      within '.spatial-subset-fields' do
        expect(page).to have_checked_field('Point')
        within '.point-fields' do
          expect(page).to have_checked_field('False')
        end

        expect(page).to have_checked_field('Polygon')
        within '.polygon-fields' do
          expect(page).to have_field('Maximum Number Of Points', with: '20.0')
          expect(page).to have_checked_field('True')
        end

        expect(page).to have_checked_field('Shapefile')
        within '.shapefile-fields' do
          within '.multiple-item-0' do
            expect(page).to have_select('Format', selected: 'ESRI')
            expect(page).to have_field('Maximum File Size In Bytes', with: '400.0')
          end
          within '.multiple-item-1' do
            expect(page).to have_select('Format', selected: 'GeoJSON')
          end
        end
      end

      expect(page).to have_checked_field('Variable Subset')
      within '.variable-subset-fields' do
        expect(page).to have_checked_field('True')
      end
    end

    expect(page).to have_select('Variable Aggregation Supported Methods', selected: ['ANOMOLY'])

    within '.supported-input-projections .multiple-item-0' do
      expect(page).to have_field('Projection Name', with: 'Geographic')
      expect(page).to have_field('Projection Latitude Of Center', with: '10.0')
      expect(page).to have_field('Projection Longitude Of Center', with: '10.0')
      expect(page).to have_field('Projection False Easting', with: '10.0')
      expect(page).to have_field('Projection False Northing', with: '10.0')
      expect(page).to have_field('Projection Authority', with: '4326')
      expect(page).to have_field('Projection Unit', with: 'Degrees')
      expect(page).to have_field('Projection Datum Name', with: 'World Geodetic System (WGS) 1984')
    end
    within '.supported-output-projections .multiple-item-0' do
      expect(page).to have_field('Projection Name', with: 'Geographic')
      expect(page).to have_field('Projection Latitude Of Center', with: '10.0')
      expect(page).to have_field('Projection Longitude Of Center', with: '10.0')
      expect(page).to have_field('Projection False Easting', with: '10.0')
      expect(page).to have_field('Projection False Northing', with: '10.0')
      expect(page).to have_field('Projection Authority', with: '4326')
      expect(page).to have_field('Projection Unit', with: 'Degrees')
      expect(page).to have_field('Projection Datum Name', with: 'World Geodetic System (WGS) 1984')
    end
    within '.supported-output-projections .multiple-item-1' do
      expect(page).to have_field('Projection Name', with: 'NAD83 / UTM zone 17N')
      expect(page).to have_field('Projection Latitude Of Center', with: '10.0')
      expect(page).to have_field('Projection Longitude Of Center', with: '10.0')
      expect(page).to have_field('Projection False Easting', with: '10.0')
      expect(page).to have_field('Projection False Northing', with: '10.0')
      expect(page).to have_field('Projection Authority', with: '26917')
      expect(page).to have_field('Projection Unit', with: 'Meters')
      expect(page).to have_field('Projection Datum Name', with: 'North American Datum (NAD) 1983')
    end

    expect(page).to have_select('Interpolation Types', selected: ['Bilinear Interpolation', 'Bicubic Interpolation'])

    within '.supported-reformattings' do
      expect(page).to have_select('Supported Input Format', selected: 'HDF-EOS2')
      expect(page).to have_select('Supported Output Formats', selected: ['HDF-EOS2', 'HDF-EOS'])
    end

    expect(page).to have_field('Max Granules', with: '50.0')
  end
end
