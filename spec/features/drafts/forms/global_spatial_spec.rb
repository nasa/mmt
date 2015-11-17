# MMT-313

require 'rails_helper'

describe 'Global spatial coverage', js: true do
  context 'when selecting global spatial coverage' do
    before do
      login
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)

      within '.metadata' do
        click_on 'Spatial Information'
      end

      open_accordions

      choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
      choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_geometry-bounding-rectangles'

      click_on 'Apply global spatial coverage'
    end

    it 'fills in the N, S, E, and W boxes' do
      expect(page).to have_field('N', with: '90')
      expect(page).to have_field('S', with: '-90')
      expect(page).to have_field('E', with: '180')
      expect(page).to have_field('W', with: '-180')
    end

    it 'updates the preview on map link' do
      link = 'https://search.sit.earthdata.nasa.gov/search/map?sb=-180%2C-90%2C180%2C90'
      within '.bounding-rectangles-fields' do
        expect(page).to have_link('Preview on Map', href: link)
      end
    end

    context 'when multiple bounding rectangles are present' do
      before do
        fill_in 'N', with: '5'
        fill_in 'S', with: '-5'
        fill_in 'E', with: '5'
        fill_in 'W', with: '-5'

        click_on 'Add another Bounding Rectangle'
        find('#draft_spatial_extent_horizontal_spatial_domain_geometry_bounding_rectangles_0 > .accordion-header').click

        within '.bounding-rectangles-fields .multiple-item-1' do
          click_on 'Apply global spatial coverage'
        end
      end

      it 'only fills in the fields for the correct rectangle' do
        within '.bounding-rectangles-fields .multiple-item-1' do
          expect(page).to have_field('N', with: '90')
          expect(page).to have_field('S', with: '-90')
          expect(page).to have_field('E', with: '180')
          expect(page).to have_field('W', with: '-180')
        end
      end

      it 'does not change the other rectangles' do
        within '.bounding-rectangles-fields .multiple-item-0' do
          expect(page).to have_field('N', with: '5')
          expect(page).to have_field('S', with: '-5')
          expect(page).to have_field('E', with: '5')
          expect(page).to have_field('W', with: '-5')
        end
      end
    end
  end
end
