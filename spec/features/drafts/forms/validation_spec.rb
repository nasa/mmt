#MMT-103, MMT-55

require 'rails_helper'

# R = Required fied
# NR = Not Required field

debug = true

required_error_string = 'Value required.'
validation_element_display_selector_string = '#validation-error-display'

empty_string = ''
very_long_string = '0' * 1000
very_short_string = '0'

good_string_values = ['good string']
good_string_value = good_string_values[0]
bad_string_values = [
  # {value: very_short_string, error: 'Value is too short'}, There are no minLengths > 1 in the schema
  {value: very_long_string, error: 'Value is too long'}
]

integer_error_string = 'Value must be of type integer'
good_integer_values = ['0', '1234', '-123', '+123', '0123', '+0123', '-0']
bad_integer_values = [
  {value: '--123', error: integer_error_string},
  {value: '++123', error: integer_error_string},
  {value: '12+34', error: integer_error_string},
  {value: '12-34', error: integer_error_string},
  {value: '12@#$', error: integer_error_string},
  {value: '#$12', error: integer_error_string},
  {value: '12abc', error: integer_error_string},
  {value: 'abc', error: integer_error_string},
  {value: '1.23', error: integer_error_string},
  {value: '1.2.3', error: integer_error_string}
]

# numbers are floats
number_error_string = 'Value must be of type number'
good_number_values = ['0', '0.0', '12.34', '-12.34', '+12.45', '012.45', '+012.45', '-0', '6.022E1', '-6.022E1']
bad_number_values = [
  {value: 'a123', error: number_error_string},
  {value: '123a', error: number_error_string},
  {value: '#.123', error: number_error_string},
  {value: '--123.45', error: number_error_string},
  {value: '++123.45', error: number_error_string},
  {value: 'as1.23', error: number_error_string},
  {value: '1.23bc', error: number_error_string},
  {value: '1.2.3', error: number_error_string},
  {value: '6.022E23E', error: number_error_string}
]

date_error_string = 'Value must match the provided pattern'
good_date_values = ['2015-07-01T00:00:00Z', '2004-02-29T00:00:00Z']
bad_date_values = [
  #{value: '2015-99-01T00:00:00Z', error: date_error_string}, # Validator does not identify erroneous date!
  #{value: '2015-07-41T00:00:00Z', error: date_error_string},
  #{value: '2015-00-01T00:00:00Z', error: date_error_string},
  #{value: '2015-02-29T00:00:00Z', error: date_error_string},
  {value: '123', error: date_error_string},
  {value: 'abc', error: date_error_string},
  {value: '2015-00-01', error: date_error_string}
]

uuid_error_string = 'Value must match the provided pattern'
good_uuid_values = ['de135797-8539-4c3a-bc20-17a83d75aa49']
bad_uuid_values = [
  {value: '#$%^&', error: uuid_error_string}
]

# Lat and Lon are floats with range restrictions
good_lat_values = ['0.0', '90']
bad_lat_values = [
  {value: '100A', error: number_error_string},
  {value: '1#{0}$0', error: number_error_string},
  {value: '100', error: 'Value is too high'},
  {value: '-100', error: 'Value is too low'},
]



describe 'Data validation for a form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when the form is empty' do
    before do
      within 'section.metadata' do
        click_on 'Data Identification'
      end
    end

    it 'simple mandatory string field validation works' do
      fill_in 'draft_entry_id', with: empty_string
      expect(page).to have_content(required_error_string)

      good_string_values.each do |test|
        fill_in 'draft_entry_id', with: test
        puts "#{test}" if debug
        expect(page).not_to have_selector(validation_element_display_selector_string)
      end

      bad_string_values.each do |test|
        fill_in 'draft_entry_id', with: test[:value]
        #puts "String: #{test[:value]}: #{test[:error]}" if debug
        expect(page).to have_content(test[:error])
      end

    end

    it 'validation between related R and NR fields works' do
      fill_in 'Short Name', with: empty_string
      expect(page).not_to have_selector(validation_element_display_selector_string)
      fill_in 'Long Name', with: 'Long Name'
      expect(page).not_to have_selector(validation_element_display_selector_string)
      fill_in 'Short Name', with: empty_string
      expect(page).to have_content(required_error_string)
      fill_in 'Long Name', with: empty_string
      expect(page).to have_content(required_error_string)
      fill_in 'Short Name', with: empty_string
      expect(page).not_to have_selector(validation_element_display_selector_string)
    end

    context 'full page validation works' do
      before do
        within '.nav-top' do
          reject_confirm_from do
            click_on 'Save & Done'
          end
        end
      end

      it 'full page validation works' do
        expect(page).to have_content('Entry Id: Value required.')
      end

    end
  end

  context 'when there is a floating point field' do
    before do
      within 'section.metadata' do
        click_on 'Data Identification'
      end
    end
    it 'general floating point validation works' do
      within '.row.organization' do
        within '.multiple.responsibilities > .multiple-item-0' do
          within '.multiple.related-urls' do
            within '.file-size' do

              good_number_values.each do |test|
                fill_in 'Size', with: test
                puts "Number: #{test}" if debug
                expect(page).not_to have_selector(validation_element_display_selector_string)
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
    end
  end

  context 'when there are integer and date fields' do
    before do
      within 'section.metadata' do
        click_on 'Temporal Extent'
      end
    end

    it 'simple integer field validation works' do

      good_integer_values.each do |test|
        fill_in 'Precision Of Seconds', with: test
        puts "Integer: #{test}" if debug
        expect(page).not_to have_selector(validation_element_display_selector_string)
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
        expect(page).not_to have_selector(validation_element_display_selector_string)
      end

      bad_date_values.each do |test|
        fill_in 'Beginning Date Time', with: test[:value]
        puts "Date: #{test[:value]}: #{test[:error]}" if debug
        expect(page).to have_content(test[:error])
      end

    end

  end

  context 'when there are Lat Lon type fields' do
    before do
      within 'section.metadata' do
        click_on 'Spatial Extent'
      end
    end

    it 'simple Latitude field validation works' do
      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'

      within '.spatial-extent' do
        within '.geometry' do
          within first('.multiple.points') do

            good_lat_values.each do |test|
              fill_in 'Latitude', with: test
              puts "Latitude #{test}" if debug
              #expect(page).to_not have_content(integer_error_string)
              expect(page).not_to have_selector(validation_element_display_selector_string)
            end

            bad_lat_values.each do |test|
              fill_in 'Latitude', with: test[:value]
              puts "Latitude #{test[:value]}: #{test[:error]}" if debug
              expect(page).to have_content(test[:error])
            end

          end
        end
      end

    end

  end

  context 'when there are Uuid type fields' do
    before do
      within 'section.metadata' do
        click_on 'Data Identification'
      end
    end

    it 'simple Uuid field validation works' do

      within '.row.organization' do
        within '.multiple.responsibilities > .multiple-item-0' do

          good_uuid_values.each do |test|
            fill_in 'Uuid', with: test
            puts "Uuid #{test}" if debug
            #expect(page).to_not have_content(integer_error_string)
            expect(page).not_to have_selector(validation_element_display_selector_string)
          end

          bad_uuid_values.each do |test|
            fill_in 'Uuid', with: test[:value]
            puts "Uuid #{test[:value]}: #{test[:error]}" if debug
            expect(page).to have_content(test[:error])
          end

        end
      end

    end

  end

  # Now for more complex testing
  context 'when there is a oneOf constraint' do
    before do
      within 'section.metadata' do
        click_on 'Temporal Extent'
      end
    end
    it 'validation of oneOf does work' do
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).not_to have_selector(validation_element_display_selector_string)
      expect(page).to have_content('Value must validate against exactly one of the provided schemas')
      choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'
      within '.single-date-times' do
        fill_in 'draft_temporal_extents_0_single_date_times_0', with: '2015-07-01T00:00:00Z'
      end
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).not_to have_selector(validation_element_display_selector_string)
    end
  end


  context 'when there is a minItems constraint' do
    before do
      within 'section.metadata' do
        click_on 'Spatial Extent'
      end
    end
    it 'validation of minItems does work' do
      # Partially populate a boundary's list of points
      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
      within '.geometry' do
        choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        within first('.multiple.g-polygons') do
          within '.point' do
            fill_in 'Longitude', with: '0.0'
            fill_in 'Latitude', with: '0.0'
          end
          within '.boundary .multiple.points' do
            fill_in 'Longitude', with: '10.0'
            fill_in 'Latitude', with: '10.0'
          end
        end
      end
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).not_to have_selector(validation_element_display_selector_string)
      expect(page).to have_content('Points: Value has too few items')

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
          end
        end
      end
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).not_to have_content('Points: Value has too few items')

      # Delete a point and the error should reappear
      within '.geometry' do
        within '.multiple.g-polygons > .multiple-item-0' do
          within '.boundary .multiple.points' do
            within '.multiple-item-1' do
              within '.remove' do
                find('.fa').click
              end
            end
          end
        end
      end
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).to have_content('Points: Value has too few items')
    end
  end

  # Test validation of an arry of simple objects
  context 'when there is an array of simple objects' do
    before do
      within 'section.metadata' do
        click_on 'Spatial Extent'
      end
    end
    it 'validation of a single object in an array of simple objects does work' do
      fill_in 'draft_spatial_keywords_0', with: very_long_string
      expect(page).to have_content('Value is too long')
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).to have_content('Spatial Keywords: Value is too long')
      fill_in 'draft_spatial_keywords_0', with: 'acceptable string'
      expect(page).to have_content('Spatial Keywords: Value is too long') # Err msg still displayed in summary area
      expect(page).not_to have_selector(validation_element_display_selector_string)
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).not_to have_content('Spatial Keywords: Value is too long')
    end

    it 'validation of subsequent objects in an array of simple objects does work' do
      fill_in 'draft_spatial_keywords_0', with: 'acceptable string'
      click_on 'Add Another Keyword'
      fill_in 'draft_spatial_keywords_1', with: very_long_string
      expect(page).to have_content('Value is too long')
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).to have_content('Spatial Keywords: Value is too long')
      fill_in 'draft_spatial_keywords_1', with: 'acceptable string'
      expect(page).not_to have_selector(validation_element_display_selector_string)
      within '.nav-top' do
        reject_confirm_from do
          click_on 'Save & Done'
        end
      end
      expect(page).not_to have_content('Spatial Keywords: Value is too long')
    end
  end


end
