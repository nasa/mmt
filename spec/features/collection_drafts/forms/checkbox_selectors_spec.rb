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
end
