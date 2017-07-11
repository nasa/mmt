# MMT-313

require 'rails_helper'

describe 'Global spatial coverage', js: true do
  context 'when selecting global spatial coverage' do
    before do
      login
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)

      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions

      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
      choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_bounding-rectangles'
      select 'Cartesian', from: 'Granule Spatial Representation'

      click_on 'Apply global spatial coverage'
    end

    it 'fills in the North, South, East, and West boxes' do
      expect(page).to have_field('North', with: '90')
      expect(page).to have_field('South', with: '-90')
      expect(page).to have_field('East', with: '180')
      expect(page).to have_field('West', with: '-180')
    end

    it 'updates the preview on map link' do
      link = 'https://search.sit.earthdata.nasa.gov/search/map?sb=-180%2C-90%2C180%2C90'
      within '.bounding-rectangles-fields' do
        expect(page).to have_link('Preview on Map', href: link)
      end
    end

    context 'when multiple bounding rectangles are present' do
      before do
        fill_in 'North', with: '5'
        fill_in 'South', with: '-5'
        fill_in 'East', with: '5'
        fill_in 'West', with: '-5'

        click_on 'Add another Bounding Rectangle'
        find('#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_0 > .eui-accordion__header').click

        # Intermittent test failure hopefully solved by clicking the
        # link with JS
        script = "$('.bounding-rectangles-fields .multiple-item-1 .global-coverage').trigger('click')"
        page.execute_script script
      end

      it 'only fills in the fields for the correct rectangle' do
        within '.bounding-rectangles-fields .multiple-item-1' do
          expect(page).to have_field('North', with: '90')
          expect(page).to have_field('South', with: '-90')
          expect(page).to have_field('East', with: '180')
          expect(page).to have_field('West', with: '-180')
        end
      end

      it 'does not change the other rectangles' do
        within '.bounding-rectangles-fields .multiple-item-0' do
          expect(page).to have_field('North', with: '5')
          expect(page).to have_field('South', with: '-5')
          expect(page).to have_field('East', with: '5')
          expect(page).to have_field('West', with: '-5')
        end
      end
    end
  end
end
