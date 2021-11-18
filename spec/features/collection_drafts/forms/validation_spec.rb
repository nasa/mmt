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

# for the AdditionalAttributes "Value" field

# boolean values
good_bool_values = ['true','false','1','0']
bad_bool_values = ['False','random string','tRue']

# date values
good_addtl_attr_dates = ['2000-02-01', '2015-01-01', '1900-03-21', '2122-12-10']
bad_addtl_attr_dates = ['2000-13-01', '2000-01-33', '2000/02/01', '2000.02.01', '2015-07-01T00:00:00Z','2015-07-01T00:00:00.000', '2015-00-01']

# time values
good_time_values = ['1:1:1', '00:00:00Z', '0:0:0.1', '23:59:59.001Z', '00:00:00']
bad_time_values = ['00:00:00.','10:01', '24:59:59', '23:60:59', '23:59:60','00:00:00.0001']

# date time values
good_datetime_values = ['2000-02-01T1:1:1', '2015-01-01T00:00:00Z', '1900-03-21T23:59:59.001Z', '2122-12-10T00:00:00']
bad_datetime_values = ['2000-12-0100:00:00', '2000-01-33T00:00:00', '2000-02-01T00:00:00.Z', '2000.02.01', '2015-07-01','2015-07-01T00:60:00.000', '2015-00-01T1:1:1.1']

# string, time string, datetime string, date string values (CMR ingests all string values/symbols)
good_string_values = ['\.[]{}()<>*+-=!?^$|✅❤️', 'string', '\string\|/', '20153324-01-01T00']

describe 'Data validation for a collection draft form', js: true do
  before do
    login
    @draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
  end

  context 'when the form is empty' do
    before do
      visit edit_collection_draft_path(@draft, form: 'collection_information')
    end

    it 'simple mandatory string field validation works' do
      find('#draft_short_name').click
      find('body').click
      expect(page).to have_content('Short Name is required')

      good_string_values.each do |test|
        fill_in 'Short Name', with: test
        find('body').click
        puts "#{test}" if debug
        expect(page).to have_no_selector(validation_error)
      end

      bad_string_values.each do |test|
        fill_in 'Short Name', with: test[:value]
        find('body').click
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
      visit edit_collection_draft_path(@draft, form: 'data_identification')

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
        find('#draft_access_constraints_value').click
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
      visit edit_collection_draft_path(@draft, form: 'related_urls')

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
            find('#draft_related_urls_0_get_data_fees').click
            within all('.col-6').first do
              expect(page).to have_no_selector(validation_error)
            end
          end

          bad_number_values.each do |test|
            fill_in 'Size', with: test[:value]
            find('#draft_related_urls_0_get_data_fees').click
            puts "Number: #{test[:value]}: #{test[:error]}" if debug
            expect(page).to have_content(test[:error])
          end
        end
      end
    end
  end

  context 'when there are integer and date fields' do
    before do
      visit edit_collection_draft_path(@draft, form: 'temporal_information')

      open_accordions
    end

    it 'simple integer field validation works' do
      choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'
      fill_in 'draft_temporal_extents_0_single_date_times_0', with: '2015-10-27T00:00:00Z'
      find('body').click

      good_integer_values.each do |test|
        fill_in 'Precision Of Seconds', with: test
        find('body').click
        puts "Integer: #{test}" if debug
        expect(page).to have_no_selector(validation_error)
      end

      bad_integer_values.each do |test|
        fill_in 'Precision Of Seconds', with: test[:value]
        find('body').click
        puts "Integer: #{test[:value]}: #{test[:error]}" if debug
        expect(page).to have_content(test[:error])
      end
    end

    it 'simple date field validation works' do
      choose 'draft_temporal_extents_0_temporal_range_type_RangeDateTime'

      good_date_values.each do |test|
        fill_in 'Beginning Date Time', with: test
        find('#draft_temporal_extents_0_precision_of_seconds').click
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
      visit edit_collection_draft_path(@draft, form: 'spatial_information')

      open_accordions
    end

    it 'simple Latitude field validation works' do
      select 'Horizontal', from: 'Spatial Coverage Type'
      script = '$(".geometry-picker.points").click();'
      page.execute_script(script)

      within '.spatial-extent' do
        within '.geometry' do
          within first('.multiple.points') do
            good_lat_values.each do |test|
              fill_in 'Longitude', with: '0'
              fill_in 'Latitude', with: test
              find('label[for=draft_spatial_extent_horizontal_spatial_domain_geometry_points_0_longitude]').click
              puts "Latitude #{test}" if debug
              expect(page).to have_no_selector(validation_error)
            end

            bad_lat_values.each do |test|
              fill_in 'Longitude', with: '0'
              fill_in 'Latitude', with: test[:value]
              find('label[for=draft_spatial_extent_horizontal_spatial_domain_geometry_points_0_longitude]').click
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
      visit edit_collection_draft_path(@draft, form: 'temporal_information')

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
      expect(page).to have_content('TemporalExtents should have one option completed')
      choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'

      within '.single-date-times' do
        fill_in 'draft_temporal_extents_0_single_date_times_0', with: '2015-07-01T00:00:00Z'
      end

      # Bamboo spontaneously started failling this test with the apparent
      # cause being that 'done' was not being clicked.  Clicking something
      # outside of the datepicker widget allows the done click to be
      # processed correctly. Previously, it looks like the click for done
      # was only exiting the single date time field.
      find('#draft_temporal_extents_0_precision_of_seconds').click
      within '.nav-top' do
        click_on 'Done'
      end

      expect(page).to have_content('Collection Draft Updated Successfully!')
    end
  end

  context 'when there is a anyOf constraint' do
    before do
      visit edit_collection_draft_path(@draft, form: 'spatial_information')

      open_accordions

      # Partially populate a boundary's list of points
      select 'Horizontal', from: 'Spatial Coverage Type'
      fill_in 'Zone Identifier', with: 'Zone ID'
      within '.geometry' do
        choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
      end
      within '.resolution-and-coordinate-system' do
        choose 'Horizontal Data Resolution'
        check 'Non Gridded Range Resolutions'
        within '.non-gridded-range-resolutions .multiple-item-0' do
          fill_in 'Minimum X Dimension', with: '2'
        end
      end
      select 'Cartesian', from: 'Granule Spatial Representation'

      within '.nav-top' do
        click_on 'Done'
      end

      click_on 'No'
    end

    it 'validation of anyOf does work' do
      within '.summary-errors' do
        expect(page).to have_content('Geometry should have one schema option completed')
        expect(page).to have_content('Non Gridded Range Resolutions should have one schema option completed')
      end

      within '.horizontal-spatial-domain' do
        expect(page).to have_selector(validation_error)
        expect(page).to have_content('Geometry should have one schema option completed')
      end

      within '.resolution-and-coordinate-system' do
        expect(page).to have_selector(validation_error)
        expect(page).to have_content('Non Gridded Range Resolutions should have one schema option completed')
      end
    end

    context 'when satisfying the anyOf constraint' do
      before do
        fill_in 'Zone Identifier', with: 'Zone ID'
        within '.geometry' do
          choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
          add_points
        end
        within '.resolution-and-coordinate-system .non-gridded-range-resolutions .multiple-item-0' do
          fill_in 'Maximum X Dimension', with: '200'
          select 'Decimal Degrees', from: 'Unit'
        end
        select 'Cartesian', from: 'Granule Spatial Representation'
      end

      it 'removes the validation error' do
        expect(page).to have_no_selector(validation_error)
        expect(page).to have_no_content('Geometry should contain any of Points, Bounding Rectangles, G Polygons, or Lines')
      end
    end
  end

  context 'when there is a minItems constraint' do
    before do
      visit edit_collection_draft_path(@draft, form: 'spatial_information')

      open_accordions
    end

    it 'validation of minItems does work' do
      # Partially populate a boundary's list of points
      select 'Horizontal', from: 'Spatial Coverage Type'
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
      visit edit_collection_draft_path(@draft, form: 'acquisition_information')

      open_accordions

      within '.platforms' do
        all('.select2-container .select2-selection').first.click
        find(:xpath, '//body').find('.select2-dropdown ul.select2-results__options--nested li.select2-results__option', text: 'A340-600').click
        within '.multiple.instruments' do
          all('.select2-container .select2-selection').first.click
          find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'ATM').click
        end
      end
    end

    it 'validation of a single object in an array of simple objects does work' do
      fill_in 'draft_platforms_0_instruments_0_operational_modes_0', with: 'this is a really long string that is too long'
      find('body').click
      expect(page).to have_content('Operational Modes is too long')

      within '.nav-top' do
        click_on 'Done'
      end
      # Reject
      click_on 'No'

      expect(page).to have_content('Operational Modes is too long')
      fill_in 'draft_platforms_0_instruments_0_operational_modes_0', with: 'Short string'
      find('body').click
      expect(page).to have_no_content('Operational Modes is too long')
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
      find('body').click
      expect(page).to have_content('Operational Modes is too long')

      within '.nav-top' do
        click_on 'Done'
      end
      # Reject
      click_on 'No'

      expect(page).to have_content('Operational Modes is too long')
      fill_in 'draft_platforms_0_instruments_0_operational_modes_1', with: 'Short string'
      find('body').click
      expect(page).to have_no_selector(validation_error)

      within '.nav-top' do
        click_on 'Done'
      end

      expect(page).to have_content('Collection Draft Updated Successfully!')
    end
  end

  context 'when there are errors on the same field within an array of fields' do
    before do
      visit edit_collection_draft_path(@draft, form: 'spatial_information')

      open_accordions

      select 'Horizontal', from: 'Spatial Coverage Type'
      script = '$(".geometry-picker.bounding-rectangles").click();'
      page.execute_script script
      click_on 'Add another Bounding Rectangle'
      open_accordions

      within '#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_0' do
        fill_in 'North', with: 'asdf'
        find('#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_0_west_bounding_coordinate').click
        find('#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_0_east_bounding_coordinate').click
        find('#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_0_south_bounding_coordinate').click
      end
      within '#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_1' do
        find('#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_1_north_bounding_coordinate').click
        fill_in 'West', with: '0'
        find('#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_1_east_bounding_coordinate').click
        find('#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_1_south_bounding_coordinate').click
      end
      find('body').click
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

  context 'when validating paired fields' do
    context 'when validating the projects start and end dates' do
      before do
        visit edit_collection_draft_path(@draft, form: 'acquisition_information')
        click_on 'Expand All'
      end

      context 'when the user has entered incorrectly formatted data' do
        before do
          fill_in 'Start Date', with: 'invalid'
          fill_in 'End Date', with: '2015-08-01T00:00:00Z'

          # click outside field to close datepicker
          find('#draft_projects_0_campaigns_0').click
        end

        it 'does not display the "start after end" error' do
          expect(page).to have_content('Start Date is an incorrect format')
          expect(page).to have_no_content('Start Date must be earlier than the End Date')
        end
      end

      context 'when the user has entered data in only one field' do
        before do
          fill_in 'Start Date', with: '2015-08-01T00:00:00Z'

          # click outside field to close datepicker
          find('#draft_projects_0_campaigns_0').click
        end

        it 'does not display the "start after end" error' do
          expect(page).to have_no_content('Start Date must be earlier than the End Date')
          expect(page).to have_field('Start Date', with: '2015-08-01T00:00:00Z')
        end
      end

      context 'when the user has entered a start date that is after an end date' do
        before do
          fill_in 'Start Date', with: '2016-08-01T00:00:00Z'
          fill_in 'End Date', with: '2015-08-01T00:00:00Z'

          # click outside field to close datepicker
          find('#draft_projects_0_campaigns_0').click
        end

        it 'displays the correct error message' do
          expect(page).to have_content('Start Date must be earlier than the End Date')
        end

        context 'when the error occurs in the second project' do
          before do
            click_on 'Add another Project'

            within '#draft_projects_1' do
              fill_in 'Start Date', with: '2016-08-01T00:00:00Z'
              fill_in 'End Date', with: '2015-08-01T00:00:00Z'

              # click outside field to close datepicker
              find('#draft_projects_1_campaigns_0').click
            end
          end

          it 'displays the error message in the second project' do
            within '#draft_projects_1' do
              expect(page).to have_content('Start Date must be earlier than the End Date')
            end
          end

          context 'when the error is not present in the first project, but is in the second' do
            before do
              # Making the second project closed the first one and the 'expand
              # all' button has already been pressed, so it's 'collapse all' now
              click_on 'Collapse All'
              click_on 'Expand All'
              within '#draft_projects_0' do
                fill_in 'Start Date', with: '2014-08-01T00:00:00Z'

                # click outside field to close datepicker
                find('#draft_projects_0_campaigns_0').click
              end
            end

            it 'displays the error only in the second project' do
              within '#draft_projects_0' do
                expect(page).to have_field('Start Date', with: '2014-08-01T00:00:00Z')
                expect(page).to have_no_content('Start Date must be earlier than the End Date')
              end

              within '#draft_projects_1' do
                expect(page).to have_field('Start Date', with: '2016-08-01T00:00:00Z')
                expect(page).to have_content('Start Date must be earlier than the End Date')
              end
            end
          end
        end
      end
    end

    context 'when validating the temporal range date times' do
      before do
        visit edit_collection_draft_path(@draft, form: 'temporal_information')
        click_on 'Expand All'

        choose 'draft_temporal_extents_0_temporal_range_type_RangeDateTime'
        fill_in 'Beginning Date Time', with: '2016-08-01T00:00:00Z'
        fill_in 'Ending Date Time', with: '2015-08-01T00:00:00Z'

        # click outside field to close datepicker
        find('#draft_temporal_extents_0_precision_of_seconds').click
      end

      it 'displays the correct error' do
        expect(page).to have_field('Beginning Date Time', with: '2016-08-01T00:00:00Z')
        expect(page).to have_content('Beginning Date Time must be earlier than the Ending Date Time')
      end
    end

    context 'when validating the tiling identification min and max fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'spatial_information')
        click_on 'Expand All'

        within '#draft_tiling_identification_systems_0_coordinate_1' do
          fill_in 'Minimum Value', with: '13.0'
          fill_in 'Maximum Value', with: '2.0'
        end
        find('#draft_tiling_identification_systems_0_tiling_identification_system_name').click
      end

      it 'displays the correct error' do
        expect(page).to have_field('Minimum Value', with: '13.0')
        expect(page).to have_content('Minimum Value must be smaller than the Maximum Value')
      end
    end

    context 'when validating Additional Attribute Value and Data Type fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'descriptive_keywords')
        click_on 'Expand All'
        fill_in 'Name', with: 'attr name'
        fill_in 'Description', with: 'attr description'
      end

      it 'validates the fields correctly when Data Type is INT' do
        select 'Integer', from: 'Data Type'

        good_integer_values.each do |int|
          addtl_attr_check_validation_and_progress_circles(int, 'INT')
        end

        bad_integer_values.each do |int|
          addtl_attr_check_validation_and_progress_circles(int[:value], 'INT', error_present: true)
        end
      end

      it 'validates the fields correctly when Data Type is FLOAT' do
        select 'Float', from: 'Data Type'

        good_number_values.each do |float|
          addtl_attr_check_validation_and_progress_circles(float, 'FLOAT')
        end

        bad_number_values.each do |float|
          addtl_attr_check_validation_and_progress_circles(float[:value], 'FLOAT', error_present: true)
        end
      end

      it 'validates the fields correctly when Data Type is BOOLEAN' do
        select 'Boolean', from: 'Data Type'

        good_bool_values.each do |bool|
          addtl_attr_check_validation_and_progress_circles(bool, 'BOOLEAN')
        end

        bad_bool_values.each do |bool|
          addtl_attr_check_validation_and_progress_circles(bool, 'BOOLEAN', error_present: true)
        end
      end

      it 'validates the fields correctly when Data Type is DATE' do
        select 'Date', from: 'Data Type'

        good_addtl_attr_dates.each do |date|
          addtl_attr_check_validation_and_progress_circles(date, 'DATE')
        end

        bad_addtl_attr_dates.each do |date|
          addtl_attr_check_validation_and_progress_circles(date, 'DATE', error_present: true)
        end
      end

      it 'validates the fields correctly when Data Type is TIME' do
        select 'Time', from: 'Data Type'

        good_time_values.each do |time|
          addtl_attr_check_validation_and_progress_circles(time, 'TIME')
        end

        bad_time_values.each do |time|
          addtl_attr_check_validation_and_progress_circles(time, 'TIME', error_present: true)
        end
      end

      it 'validates the fields correctly when Data Type is DATETIME' do
        select 'Date time', from: 'Data Type'

        good_datetime_values.each do |dt|
          addtl_attr_check_validation_and_progress_circles(dt, 'DATETIME')
        end

        bad_datetime_values.each do |dt|
          addtl_attr_check_validation_and_progress_circles(dt, 'DATETIME', error_present: true)
        end
      end

      it 'validates the fields correctly when Data Type is STRING' do
        select 'String', from: 'Data Type'

        good_string_values.each do |str|
          addtl_attr_check_validation_and_progress_circles(str, 'STRING')
        end
      end

      it 'validates the fields correctly when Data Type is DATETIME_STRING' do
        select 'Date Time String', from: 'Data Type'

        good_string_values.each do |str|
          addtl_attr_check_validation_and_progress_circles(str, 'DATETIME_STRING')
        end
      end

      it 'validates the fields correctly when Data Type is DATE_STRING' do
        select 'Date String', from: 'Data Type'

        good_string_values.each do |str|
          addtl_attr_check_validation_and_progress_circles(str, 'DATE_STRING')
        end
      end

      it 'validates the fields correctly when Data Type is TIME_STRING' do
        select 'Time String', from: 'Data Type'

        good_string_values.each do |str|
          addtl_attr_check_validation_and_progress_circles(str, 'TIME_STRING')
        end
      end
    end
  end

  context 'when visiting a field directly from a progress circle or link' do
    # with the progressive update feature, it was determined that if a user
    # is visiting a field directly, whether from a progress circle or error link
    # the user is intending to correctly fill out the field. Therefore, validation
    # should be triggered immediately on page load for the field visited
    before do
      visit collection_draft_path(@draft)
    end

    context 'when the progress circle or link is to a specific field' do
      before do
        # click on a progress circle linking to a specific field
        within '.progress-indicator #data-identification' do
          click_on 'Processing Level - Required'
        end
      end

      it 'displays the errors correctly' do
        within '.eui-banner--danger.summary-errors' do
          expect(page).to have_content('This draft has the following errors:')
          expect(page).to have_link('ID is required')
        end

        within '.processing-level-fields' do
          expect(page).to have_css('.eui-banner--danger.validation-error', text: 'ID is required')
        end
      end
    end

    context 'when the progress circle or link is to a top level Collection Information form field' do
      # links to the Collection Information page are appended with `_label` for some reason
      before do
        within '.progress-indicator #collection-information' do
          click_on 'Abstract - Required'
        end
      end

      it 'displays the errors correctly' do
        within '.eui-banner--danger.summary-errors' do
          expect(page).to have_content('This draft has the following errors:')
          expect(page).to have_link('Abstract is required')
        end

        expect(page).to have_css('.eui-banner--danger.validation-error', text: 'Abstract is required')
      end
    end

    context 'when the progress circle or link is to a fieldset' do
      # some progress circles link to a fieldset or top level field, and not to a
      # specific field directly
      # depending on the structure of the fieldset, an inline validation
      # might not be triggered unless there is some data in the fieldset
      context 'When the fieldset has data' do
        before do
          # fill in a field
          visit edit_collection_draft_path(@draft, form: 'data_centers')

          fill_in 'Service Hours', with: '9-12'

          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Yes'

          # visit the progress circle
          within '.progress-indicator #data-centers' do
            click_on 'Data Centers Invalid'
          end
        end

        it 'displays the errors correctly' do
          within '.eui-banner--danger.summary-errors' do
            expect(page).to have_content('This draft has the following errors:')
            expect(page).to have_link('Roles is required')
            expect(page).to have_link('Short Name is required')
          end

          within '#draft_data_centers_0' do
            expect(page).to have_css('.eui-banner--danger.validation-error', text: 'Roles is required')
            expect(page).to have_css('.eui-banner--danger.validation-error', text: 'Short Name is required')
          end
        end
      end

      context 'When the fieldset is empty' do
        before do
          # visit the progress circle
          within '.progress-indicator #data-centers' do
            click_on 'Data Centers - Required'
          end
        end

        it 'displays the top level required field errors' do
          within '.eui-banner--danger.summary-errors' do
            expect(page).to have_content('This draft has the following errors:')
            expect(page).to have_content('DataCenters is required')
          end
        end

        it 'does not display in-line errors' do
          expect(page).to have_no_css('.eui-banner--danger.validation-errors')

          expect(page).to have_no_content('Roles is required')
          expect(page).to have_no_content('Short Name is required')
        end
      end
    end
  end
end
