# Radio buttons are used when oneOf validations are used in the schema.
# The radio button is used to select which form should be shown
# By default, none of the sub-forms should be shown

require 'rails_helper'

describe 'Radio button form selectors', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when viewing geometry fields' do
    before do
      within '.metadata' do
        click_on 'Spatial Information'
      end

      open_accordions

      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
    end

    it 'does not show any geometry fields' do
      expect(page).to have_no_css('.points-fields')
      expect(page).to have_no_css('.bounding-rectangles-fields')
      expect(page).to have_no_css('.g-polygons-fields')
      expect(page).to have_no_css('.lines-fields')
    end

    context 'when selecting points' do
      before do
        script = '$(".geometry-picker.points").click();'
        page.execute_script script
      end

      it 'displays the points fields' do
        expect(page).to have_css('.points-fields')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.bounding-rectangles-fields')
        expect(page).to have_no_css('.g-polygons-fields')
        expect(page).to have_no_css('.lines-fields')
      end
    end

    context 'when selecting bounding rectangles' do
      before do
        script = '$(".geometry-picker.bounding-rectangles").click();'
        page.execute_script script
      end

      it 'displays the bounding rectangles fields' do
        expect(page).to have_css('.bounding-rectangles-fields')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.points-fields')
        expect(page).to have_no_css('.g-polygons-fields')
        expect(page).to have_no_css('.lines-fields')
      end
    end

    context 'when selecting g polygons' do
      before do
        script = '$(".geometry-picker.g-polygons").click();'
        page.execute_script script
      end

      it 'displays the g polygons fields' do
        expect(page).to have_css('.g-polygons-fields')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.points-fields')
        expect(page).to have_no_css('.bounding-rectangles-fields')
        expect(page).to have_no_css('.lines-fields')
      end
    end

    context 'when selecting lines' do
      before do
        script = '$(".geometry-picker.lines").click();'
        page.execute_script script
      end

      it 'displays the lines fields' do
        expect(page).to have_css('.lines-fields')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.points-fields')
        expect(page).to have_no_css('.bounding-rectangles-fields')
        expect(page).to have_no_css('.g-polygons-fields')
      end
    end

    context 'when switching between options after filling in form data' do
      before do
        add_points

        script = '$(".geometry-picker.lines").click();'
        page.execute_script script

        script = '$(".geometry-picker.points").click();'
        page.execute_script script
      end

      it 'clears the form data' do
        expect(page).to have_field('Longitude', with: '')
        expect(page).to have_field('Latitude', with: '')
      end
    end
  end

  context 'when viewing spatial coverage type fields' do
    before do
      within '.metadata' do
        click_on 'Spatial Information'
      end

      open_accordions
    end

    it 'does not show any spatial coverage fields' do
      expect(page).to have_no_css('.spatial-coverage-type.horizontal')
      expect(page).to have_no_css('.spatial-coverage-type.vertical')
    end

    context 'when selecting horizontal spatial coverage' do
      before do
        choose 'draft_spatial_information_spatial_coverage_type_HORIZONTAL'
      end

      it 'displays the horizontal coordinate system fields' do
        expect(page).to have_css('.spatial-coverage-type.horizontal')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.spatial-coverage-type.vertical')
      end
    end

    context 'when selecting vertical spatial coverage' do
      before do
        choose 'draft_spatial_information_spatial_coverage_type_VERTICAL'
      end

      it 'displays the vertical coordinate system fields' do
        expect(page).to have_css('.spatial-coverage-type.vertical')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.spatial-coverage-type.horizontal')
      end
    end

    context 'when selecting both spatial coverage' do
      before do
        choose 'draft_spatial_information_spatial_coverage_type_BOTH'
      end

      it 'displays the horizontal and vertical coordinate system fields' do
        expect(page).to have_css('.spatial-coverage-type.horizontal')
        expect(page).to have_css('.spatial-coverage-type.vertical')
      end
    end

    context 'when switching between options after filling in form data' do
      before do
        choose 'draft_spatial_information_spatial_coverage_type_HORIZONTAL'
        fill_in 'Horizontal Datum Name', with: 'Datum name'
        fill_in 'Ellipsoid Name', with: 'Ellipsoid name'
        fill_in 'Semi Major Axis', with: '3.0'
        fill_in 'Denominator Of Flattening Ratio', with: '4.0'

        find('.coordinate-system-picker.geographic').click
        fill_in 'Geographic Coordinate Units', with: 'Coordinate units'
        fill_in 'Latitude Resolution', with: '42.0'
        fill_in 'Longitude Resolution', with: '43.0'

        choose 'draft_spatial_information_spatial_coverage_type_VERTICAL'

        choose 'draft_spatial_information_spatial_coverage_type_HORIZONTAL'
      end

      it 'clears the form data' do
        expect(page).to have_field('Horizontal Datum Name', with: '')
        expect(page).to have_field('Ellipsoid Name', with: '')
        expect(page).to have_field('Semi Major Axis', with: '')
        expect(page).to have_field('Denominator Of Flattening Ratio', with: '')

        expect(page).to have_no_css('.geographic-coordinate-system-fields')
        expect(page).to have_no_css('.local-coordinate-system-fields')
      end

      it 'resets coordinate system radio buttons' do
        expect(find('.coordinate-system-picker.geographic')).to_not be_checked
      end
    end
  end

  context 'when viewing coordinate system type fields' do
    before do
      within '.metadata' do
        click_on 'Spatial Information'
      end

      open_accordions

      choose 'draft_spatial_information_spatial_coverage_type_HORIZONTAL'
    end

    it 'does not show any coordinate system fields' do
      expect(page).to have_no_css('.geographic-coordinate-system-fields')
      expect(page).to have_no_css('.local-coordinate-system-fields')
    end

    context 'when selecting geographic coordinate system' do
      before do
        find('.coordinate-system-picker.geographic').click
      end

      it 'displays the geographic coordinate system fields' do
        expect(page).to have_css('.geographic-coordinate-system-fields')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.local-coordinate-system-fields')
      end
    end

    context 'when selecting local coordinate system' do
      before do
        find('.coordinate-system-picker.local').click
      end

      it 'displays the local coordinate system fields' do
        expect(page).to have_css('.local-coordinate-system-fields')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.geographic-coordinate-system-fields')
      end
    end

    context 'when switching between options after filling in form data' do
      before do
        find('.coordinate-system-picker.geographic').click
        fill_in 'Geographic Coordinate Units', with: 'Coordinate units'
        fill_in 'Latitude Resolution', with: '42.0'
        fill_in 'Longitude Resolution', with: '43.0'

        find('.coordinate-system-picker.local').click

        find('.coordinate-system-picker.geographic').click
      end

      it 'clears the form data' do
        expect(page).to have_field('Geographic Coordinate Units', with: '')
        expect(page).to have_field('Latitude Resolution', with: '')
        expect(page).to have_field('Longitude Resolution', with: '')
      end
    end
  end

  context 'when viewing temporal range type fields' do
    before do
      within '.metadata' do
        click_on 'Temporal Information'
      end

      open_accordions
    end

    it 'does not show any temporal range fields' do
      expect(page).to have_no_css('.temporal-range-type.single-date-time')
      expect(page).to have_no_css('.temporal-range-type.range-date-time')
      expect(page).to have_no_css('.temporal-range-type.periodic-date-time')
    end

    context 'when selecting single date time' do
      before do
        choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'
      end

      it 'displays the single date time fields' do
        expect(page).to have_css('.temporal-range-type.single-date-time')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.temporal-range-type.range-date-time')
        expect(page).to have_no_css('.temporal-range-type.periodic-date-time')
      end
    end

    context 'when selecting range date time' do
      before do
        choose 'draft_temporal_extents_0_temporal_range_type_RangeDateTime'
      end

      it 'displays the range date time fields' do
        expect(page).to have_css('.temporal-range-type.range-date-time')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.temporal-range-type.single-date-time')
        expect(page).to have_no_css('.temporal-range-type.periodic-date-time')
      end
    end

    context 'when selecting periodic date time' do
      before do
        choose 'draft_temporal_extents_0_temporal_range_type_PeriodicDateTime'
      end

      it 'displays the periodic date time fields' do
        expect(page).to have_css('.temporal-range-type.periodic-date-time')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.temporal-range-type.single-date-time')
        expect(page).to have_no_css('.temporal-range-type.range-date-time')
      end
    end

    context 'when switching between options after filling in form data' do
      before do
        choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'

        fill_in 'draft_temporal_extents_0_single_date_times_0', with: '2015-07-01T00:00:00Z'

        choose 'draft_temporal_extents_0_temporal_range_type_RangeDateTime'

        choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'
      end

      it 'clears the form data' do
        expect(page).to have_field('draft_temporal_extents_0_single_date_times_0', with: '')
      end
    end
  end
end
