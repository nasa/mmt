describe 'Service Options Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'options')
  end

  context 'when submitting the form' do
    before do
      select 'Spatial', from: 'Subset Types'
      select 'ANOMOLY', from: 'Variable Aggregation Supported Methods'

      within '.supported-input-projections .multiple-item-0' do
        select 'Geographic', from: 'Projection Name'
        fill_in 'Projection Latitude Of Center', with: 10
        fill_in 'Projection Longitude Of Center', with: 10
        fill_in 'Projection False Easting', with: 10
        fill_in 'Projection False Northing', with: 10
        fill_in 'Projection Authority', with: '4326'
        select 'Degrees', from: 'Projection Unit'
        select 'World Geodetic System (WGS) 1984', from: 'Projection Datum Name'
      end

      within '.multiple.supported-output-projections' do
        within '.multiple-item-0' do
          select 'Geographic', from: 'Projection Name'
          fill_in 'Projection Latitude Of Center', with: 10
          fill_in 'Projection Longitude Of Center', with: 10
          fill_in 'Projection False Easting', with: 10
          fill_in 'Projection False Northing', with: 10
          fill_in 'Projection Authority', with: '4326'
          select 'Degrees', from: 'Projection Unit'
          select 'World Geodetic System (WGS) 1984', from: 'Projection Datum Name'
        end

        click_on 'Add another Supported Output Projection'

        within '.multiple-item-1' do
          select 'NAD83 / UTM zone 17N', from: 'Projection Name'
          fill_in 'Projection Latitude Of Center', with: 10
          fill_in 'Projection Longitude Of Center', with: 10
          fill_in 'Projection False Easting', with: 10
          fill_in 'Projection False Northing', with: 10
          fill_in 'Projection Authority', with: '26917'
          select 'Meters', from: 'Projection Unit'
          select 'North American Datum (NAD) 1983', from: 'Projection Datum Name'
        end
      end

      select 'Bilinear Interpolation', from: 'Interpolation Types'
      select 'Bicubic Interpolation', from: 'Interpolation Types'

      select 'HDF-EOS2', from: 'Supported Input Formats'
      select 'HDF-EOS5', from: 'Supported Input Formats'
      select 'HDF-EOS2', from: 'service_draft_draft_service_options_supported_output_formats'
      select 'HDF-EOS5', from: 'service_draft_draft_service_options_supported_output_formats'

      fill_in 'Max Granules', with: 50

      within '.supported-reformattings' do
        select 'HDF-EOS2', from: 'Supported Input Format'
        select 'HDF-EOS2', from: 'Supported Output Formats'
        select 'HDF-EOS', from: 'Supported Output Formats'
      end

      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    context 'when viewing the form' do
      include_examples 'Options Form'
    end
  end
end
