require 'rails_helper'

describe 'checkboxes form selectors', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when viewing geometry fields' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      expect(page).to have_content('Spatial Information')

      open_accordions

      select 'Horizontal', from: 'Spatial Coverage Type'
    end

    it 'does not show any geometry fields' do
      expect(page).to have_no_css('.points-fields')
      expect(page).to have_no_css('.bounding-rectangles-fields')
      expect(page).to have_no_css('.g-polygons-fields')
      expect(page).to have_no_css('.lines-fields')
    end

    context 'when selecting points' do
      before do
        check 'Points'
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
        check 'Bounding Rectangles'
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
        check 'G Polygons'
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
        check 'Lines'
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
        uncheck 'Points'
        check 'Points'
      end

      it 'clears the form data' do
        expect(page).to have_field('Longitude', with: '')
        expect(page).to have_field('Latitude', with: '')
      end
    end

    context 'when selecting multiple Geometry types' do
      before do
        check 'Points'
        check 'Bounding Rectangles'
        check 'G Polygons'
        check 'Lines'
      end

      it 'displays all the geometry fields' do
        expect(page).to have_css('.points-fields')
        expect(page).to have_css('.bounding-rectangles-fields')
        expect(page).to have_css('.g-polygons-fields')
        expect(page).to have_css('.lines-fields')
      end
    end
  end

  context 'when viewing horizontal data resolution fields' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      expect(page).to have_content('Spatial Information')

      open_accordions

      select 'Horizontal', from: 'Spatial Coverage Type'
      choose 'Horizontal Data Resolution'
    end

    it 'does not show any horizontal data resolution fields' do
      expect(page).to have_no_css('.horizontal-data-resolution-fields.point-resolution')
      expect(page).to have_no_css('.horizontal-data-resolution-fields.varies-resolution')
      expect(page).to have_no_css('.horizontal-data-resolution-fields.non-gridded-resolutions')
      expect(page).to have_no_css('.horizontal-data-resolution-fields.non-gridded-range-resolutions')
      expect(page).to have_no_css('.horizontal-data-resolution-fields.gridded-resolutions')
      expect(page).to have_no_css('.horizontal-data-resolution-fields.gridded-range-resolutions')
      expect(page).to have_no_css('.horizontal-data-resolution-fields.generic-resolutions')
    end

    context 'when selecting non gridded range resolutions' do
      before do
        check 'Non Gridded Range Resolutions'
      end

      it 'displays the non gridded range resolutions fields' do
        expect(page).to have_css('.non-gridded-range-resolutions')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.horizontal-data-resolution-fields.point-resolution')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.varies-resolution')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.non-gridded-resolutions')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.gridded-resolutions')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.gridded-range-resolutions')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.generic-resolutions')
      end
    end

    context 'when selecting gridded resolutions' do
      before do
        check 'Gridded Resolutions'
      end

      it 'displays the lines fields' do
        expect(page).to have_css('.gridded-resolutions')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.horizontal-data-resolution-fields.point-resolution')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.varies-resolution')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.non-gridded-resolutions')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.non-gridded-range-resolutions')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.gridded-range-resolutions')
        expect(page).to have_no_css('.horizontal-data-resolution-fields.generic-resolutions')
      end
    end

    context 'when switching between options after filling in form data' do
      before do
        check 'Generic Resolutions'

        within '.horizontal-data-resolution-fields.generic-resolutions' do
          fill_in 'X Dimension', with: '20'
          fill_in 'Y Dimension', with: '50'
          select 'Meters', from: 'Unit'
        end

        uncheck 'Generic Resolutions'
        check 'Generic Resolutions'
      end

      it 'clears the form data' do
        within '.horizontal-data-resolution-fields.generic-resolutions' do
          expect(page).to have_field('X Dimension', with: '')
          expect(page).to have_field('Y Dimension', with: '')
          expect(page).to have_field('Unit', with: '')
          expect(page).to have_no_css('label.eui-required-o')
          expect(page).to have_no_css('label.eui-required-grey-o')
        end
      end
    end
  end
end
