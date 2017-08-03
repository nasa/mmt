# MMT-103, MMT-55

require 'rails_helper'

# R = Required fied
# NR = Not Required field

debug = false

validation_error = '.validation-error'

empty_string = ''
very_long_string = '0' * 1000

good_string_values = ['good string']
bad_string_values = [
  { value: very_long_string, error: 'Short Name is too long' }
]

integer_error_string = 'Precision Of Seconds must be of type integer'
good_integer_values = ['0', '1234', '-123', '+123', '0123', '+0123', '-0']
bad_integer_values = [
  { value: '--123', error: integer_error_string },
  { value: '++123', error: integer_error_string },
  { value: '12+34', error: integer_error_string },
  { value: '12-34', error: integer_error_string },
  { value: '12@#$', error: integer_error_string },
  { value: '#$12', error: integer_error_string },
  { value: '12abc', error: integer_error_string },
  { value: 'abc', error: integer_error_string },
  { value: '1.23', error: integer_error_string },
  { value: '1.2.3', error: integer_error_string }
]

# numbers are floats
number_error_string = 'Size must be of type number'
good_number_values = ['0', '0.0', '12.34', '-12.34', '+12.45', '012.45', '+012.45', '-0', '6.022E1', '-6.022E1']
bad_number_values = [
  { value: 'a123', error: number_error_string },
  { value: '123a', error: number_error_string },
  { value: '#.123', error: number_error_string },
  { value: '--123.45', error: number_error_string },
  { value: '++123.45', error: number_error_string },
  { value: 'as1.23', error: number_error_string },
  { value: '1.23bc', error: number_error_string },
  { value: '1.2.3', error: number_error_string },
  { value: '6.022E23E', error: number_error_string }
]

date_error_string = 'Beginning Date Time is an incorrect format'
good_date_values = ['2015-07-01T00:00:00Z', '2004-02-29T00:00:00Z']
bad_date_values = [
  { value: '123', error: date_error_string },
  { value: 'abc', error: date_error_string },
  { value: '2015-00-01', error: date_error_string }
]

# Lat and Lon are floats with range restrictions
good_lat_values = ['0.0', '90']
bad_lat_values = [
  { value: '100A', error: 'Latitude must be of type number' },
  { value: '1#{0}$0', error: 'Latitude must be of type number' },
  { value: '100', error: 'Latitude is too high' },
  { value: '-100', error: 'Latitude is too low' }
]

describe 'Data validation for a form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when the form is empty' do
    before do
      within 'section.metadata' do
        click_on 'Collection Information'
      end
    end

    it 'simple mandatory string field validation works' do
      fill_in 'Short Name', with: empty_string
      expect(page).to have_content('Short Name is required')

      good_string_values.each do |test|
        fill_in 'Short Name', with: test
        puts "#{test}" if debug
        expect(page).to have_no_selector(validation_error)
      end

      bad_string_values.each do |test|
        fill_in 'Short Name', with: test[:value]
        puts "String: #{test[:value]}: #{test[:error]}" if debug
        expect(page).to have_content(test[:error])
      end
    end

    context 'full page validation works' do
      before do
        within '.nav-top' do
          click_on 'Done'
        end
        # Reject
        click_on 'No'
      end

      it 'full page validation works' do
        expect(page).to have_content('Short Name is required')
      end
    end
  end

  context 'when conditionally required fields are present' do
    before do
      within 'section.metadata' do
        click_on 'Data Identification'
      end

      open_accordions
    end

    it 'validation between related R and NR fields works' do
      within '.access-constraints' do
        expect(page).to have_no_selector(validation_error)

        fill_in 'Value', with: '42'
      end
      within '.nav-top' do
        click_on 'Done'
      end
      # Reject
      click_on 'No'
      within '.access-constraints' do
        expect(page).to have_content('Description is required')
        expect(page).to have_selector(validation_error)

        fill_in 'Description', with: 'description'
        expect(page).to have_no_selector(validation_error)

        fill_in 'Description', with: empty_string
      end
      within '.nav-top' do
        click_on 'Done'
      end
      # Reject
      click_on 'No'
      within '.access-constraints' do
        expect(page).to have_content('Description is required')
        expect(page).to have_selector(validation_error)
      end
    end
  end

  context 'when there is a floating point field' do
    before do
      within 'section.metadata' do
        click_on 'Related URLs', match: :first
      end

      open_accordions
    end

    it 'general floating point validation works' do
      within '.multiple.related-urls' do
        select 'Distribution URL', from: 'URL Content Type'
        select 'Get Data', from: 'Type'
        within '.get-data' do
          good_number_values.each do |test|
            fill_in 'Size', with: test
            puts "Number: #{test}" if debug
            within all('.col-6').first do
              expect(page).to have_no_selector(validation_error)
            end
          end

          bad_number_values.each do |test|
            fill_in 'Size', with: test[:value]
            puts "Number: #{test[:value]}: #{test[:error]}" if debug
            expect(page).to have_content(test[:error])
          end
        end
      end
    end
  end

  context 'when there are integer and date fields' do
    before do
      within 'section.metadata' do
        click_on 'Temporal Information'
      end

      open_accordions
    end

    it 'simple integer field validation works' do
      choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'
      fill_in 'draft_temporal_extents_0_single_date_times_0', with: '2015-10-27T00:00:00Z'

      good_integer_values.each do |test|
        fill_in 'Precision Of Seconds', with: test
        puts "Integer: #{test}" if debug
        expect(page).to have_no_selector(validation_error)
      end

      bad_integer_values.each do |test|
        fill_in 'Precision Of Seconds', with: test[:value]
        puts "Integer: #{test[:value]}: #{test[:error]}" if debug
        expect(page).to have_content(test[:error])
      end
    end

    it 'simple date field validation works' do
      choose 'draft_temporal_extents_0_temporal_range_type_RangeDateTime'

      good_date_values.each do |test|
        fill_in 'Beginning Date Time', with: test
        puts "Date: #{test}" if debug
        expect(page).to have_no_selector(validation_error)
      end

      bad_date_values.each do |test|
        fill_in 'Beginning Date Time', with: test[:value]
        # click outside field to close datepicker and trigger validation
        find('#draft_temporal_extents_0_precision_of_seconds').click
        puts "Date: #{test[:value]}: #{test[:error]}" if debug
        expect(page).to have_content(test[:error])
      end
    end
  end

  context 'when there are Lat Lon type fields' do
    before do
      within 'section.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions
    end

    it 'simple Latitude field validation works' do
      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
      script = '$(".geometry-picker.points").click();'
      page.execute_script script

      within '.spatial-extent' do
        within '.geometry' do
          within first('.multiple.points') do
            good_lat_values.each do |test|
              fill_in 'Longitude', with: '0'
              fill_in 'Latitude', with: test
              puts "Latitude #{test}" if debug
              expect(page).to have_no_selector(validation_error)
            end

            bad_lat_values.each do |test|
              fill_in 'Longitude', with: '0'
              fill_in 'Latitude', with: test[:value]
              puts "Latitude #{test[:value]}: #{test[:error]}" if debug
              expect(page).to have_content(test[:error])
            end
          end
        end
      end
    end
  end

  # Now for more complex testing
  context 'when there is a oneOf constraint' do
    before do
      within 'section.metadata' do
        click_on 'Temporal Information'
      end

      open_accordions
    end

    it 'validation of oneOf does work' do
      choose 'draft_temporal_extents_0_ends_at_present_flag_true'

      within '.nav-top' do
        click_on 'Done'
      end
      # Reject
      click_on 'No'

      expect(page).to have_selector(validation_error)
      expect(page).to have_content('TemporalExtents should have one type completed')
      choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'

      within '.single-date-times' do
        fill_in 'draft_temporal_extents_0_single_date_times_0', with: '2015-07-01T00:00:00Z'
      end

      within '.nav-top' do
        click_on 'Done'
      end

      expect(page).to have_content('Collection Draft Updated Successfully!')
    end
  end

  context 'when there is a minItems constraint' do
    before do
      within 'section.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions
    end

    it 'validation of minItems does work' do
      # Partially populate a boundary's list of points
      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
      script = '$(".geometry-picker.g-polygons").click();'
      page.execute_script script

      within '.geometry' do
        choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        within first('.multiple.g-polygons') do
          within '.boundary .multiple.points' do
            fill_in 'Longitude', with: '10.0'
            fill_in 'Latitude', with: '10.0'
          end
        end
      end

      select 'Cartesian', from: 'draft_spatial_extent_granule_spatial_representation'

      within '.nav-top' do
        click_on 'Done'
      end

      # Reject
      click_on 'No'

      expect(page).to have_selector(validation_error)
      expect(page).to have_content('Points has too few items')

      # Fully populate a boundary's list of points
      within '.geometry' do
        within '.multiple.g-polygons > .multiple-item-0' do
          within '.boundary .multiple.points' do
            click_on 'Add another Point'
            within '.multiple-item-1' do
              fill_in 'Longitude', with: '-10.0'
              fill_in 'Latitude', with: '-10.0'
            end
            click_on 'Add another Point'
            within '.multiple-item-2' do
              fill_in 'Longitude', with: '10.0'
              fill_in 'Latitude', with: '-10.0'
            end
            click_on 'Add another Point'
            within '.multiple-item-3' do
              fill_in 'Longitude', with: '10.0'
              fill_in 'Latitude', with: '10.0'
            end
          end
        end
      end

      within '.nav-top' do
        click_on 'Done'
      end

      expect(page).to have_content('Collection Draft Updated Successfully!')
      # # Reject
      # click_on 'No'

      # expect(page).to have_no_content('Points has too few items')

      # # Delete a point and the error should reappear
      # within '.geometry' do
      #   within '.multiple.g-polygons > .multiple-item-0' do
      #     within '.boundary .multiple.points' do
      #       within '.multiple-item-1' do
      #         find('.remove').click
      #       end
      #     end
      #   end
      # end

      # within '.nav-top' do
      #   click_on 'Done'
      # end
      # # Reject
      # click_on 'No'

      # expect(page).to have_content('Points has too few items')
    end
  end

  # Test validation of an arry of simple objects
  context 'when there is an array of simple objects' do
    before do
      within 'section.metadata' do
        click_on 'Acquisition Information'
      end

      open_accordions

      fill_in 'draft_platforms_0_short_name', with: 'short_name'
      fill_in 'draft_platforms_0_instruments_0_short_name', with: 'short_name'
    end

    it 'validation of a single object in an array of simple objects does work' do
      fill_in 'draft_platforms_0_instruments_0_operational_modes_0', with: 'this is a really long string that is too long'
      expect(page).to have_content('OperationalModes is too long')

      within '.nav-top' do
        click_on 'Done'
      end
      # Reject
      click_on 'No'

      expect(page).to have_content('OperationalModes is too long')
      fill_in 'draft_platforms_0_instruments_0_operational_modes_0', with: 'Short string'
      expect(page).to have_no_content('OperationalModes is too long')
      expect(page).to have_no_selector(validation_error)

      within '.nav-top' do
        click_on 'Done'
      end

      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'validation of subsequent objects in an array of simple objects does work' do
      fill_in 'draft_platforms_0_instruments_0_operational_modes_0', with: 'Short string'
      click_on 'Add another Operational Mode'
      fill_in 'draft_platforms_0_instruments_0_operational_modes_1', with: 'this is a really long string that is too long'
      expect(page).to have_content('OperationalModes is too long')

      within '.nav-top' do
        click_on 'Done'
      end
      # Reject
      click_on 'No'

      expect(page).to have_content('OperationalModes is too long')
      fill_in 'draft_platforms_0_instruments_0_operational_modes_1', with: 'Short string'
      expect(page).to have_no_selector(validation_error)

      within '.nav-top' do
        click_on 'Done'
      end

      expect(page).to have_content('Collection Draft Updated Successfully!')
    end
  end

  context 'when there are errors on the same field within an array of fields' do
    before do
      within 'section.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions

      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
      script = '$(".geometry-picker.bounding-rectangles").click();'
      page.execute_script script
      click_on 'Add another Bounding Rectangle'
      open_accordions

      within '#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_0' do
        fill_in 'North', with: 'asdf'
        fill_in 'West', with: ''
        fill_in 'East', with: ''
        fill_in 'South', with: ''
      end
      within '#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_1' do
        fill_in 'North', with: ''
        fill_in 'West', with: '0'
        fill_in 'East', with: ''
        fill_in 'South', with: ''
      end
    end

    it 'displays the errors correctly' do
      within '#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_0' do
        expect(page).to have_content('North must be of type number')
        expect(page).to have_content('West is required')
        expect(page).to have_content('East is required')
        expect(page).to have_content('South is required')
      end
      within '#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_1' do
        expect(page).to have_content('North is required')
        expect(page).to have_content('East is required')
        expect(page).to have_content('South is required')
      end
    end
  end
end
