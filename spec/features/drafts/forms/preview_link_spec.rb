# MMT-35

require 'rails_helper'

describe 'Preview on Map link', js: true do
  base_link = 'https://search.sit.earthdata.nasa.gov/search/map'
  point_link = 'https://search.sit.earthdata.nasa.gov/search/map?sp=-77.123%2C38.789'
  rectangle_link = 'https://search.sit.earthdata.nasa.gov/search/map?sb=-50.1%2C-45.2%2C-45.3%2C50.4'
  polygon_link = 'https://search.sit.earthdata.nasa.gov/search/map?polygon=0.1%2C0.1%2C10.2%2C10.2%2C20.3%2C10.3%2C0.1%2C0.1'

  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)

    within '.metadata' do
      click_on 'Spatial Information'
    end

    open_accordions

    choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
  end

  context 'when adding a new point to the form' do
    before do
      script = '$(".geometry-picker.points").click();'
      page.execute_script script

      within first('.multiple.points') do
        fill_in 'Latitude', with: '38.789'
        fill_in 'Longitude', with: '-77.123'
      end
    end

    it 'generates a link to Earthdata Search' do
      expect(page).to have_link('Preview on Map', href: point_link)
    end

    context 'when clicking "Add another Point"' do
      before do
        within first('.multiple.points') do
          click_on 'Add another Point'
        end
      end

      it 'resets the preview url in the new accordion' do
        within first('.multiple.points > .multiple-item-1') do
          expect(page).to have_no_link('Preview on Map', href: point_link)
          expect(page).to have_link('Preview on Map', href: base_link)
        end
      end

      context 'when saving and reloading the page' do
        before do
          within '.nav-top' do
            click_on 'Save & Done'
          end
          # Accept
          click_on 'Yes'

          within '.metadata' do
            click_on 'Spatial Information'
          end

          open_accordions
        end

        it 'generates the link to Earthdata Search' do
          expect(page).to have_link('Preview on Map', href: point_link)
        end
      end
    end
  end

  context 'when adding a new rectangle to the form' do
    before do
      script = '$(".geometry-picker.bounding-rectangles").click();'
      page.execute_script script

      within first('.multiple.bounding-rectangles') do
        fill_in 'W', with: '-50.1'
        fill_in 'N', with: '50.4'
        fill_in 'E', with: '-45.3'
        fill_in 'S', with: '-45.2'
      end
    end

    it 'generates a link to Earthdata Search' do
      expect(page).to have_link('Preview on Map', rectangle_link)
    end

    context 'when clicking "Add another Rectangle"' do
      before do
        within first('.multiple.bounding-rectangles') do
          click_on 'Add another Bounding Rectangle'
        end
      end

      it 'resets the preview url in the new accordion' do
        within first('.multiple.bounding-rectangles > .multiple-item-1') do
          expect(page).to have_no_link('Preview on Map', href: rectangle_link)
          expect(page).to have_link('Preview on Map', href: base_link)
        end
      end

      context 'when saving and reloading the page' do
        before do
          within '.nav-top' do
            click_on 'Save & Done'
          end
          # Accept
          click_on 'Yes'

          within '.metadata' do
            click_on 'Spatial Information'
          end

          open_accordions
        end

        it 'generates the link to Earthdata Search' do
          expect(page).to have_link('Preview on Map', href: rectangle_link)
        end
      end
    end
  end

  context 'when adding a new polygon to the form' do
    before do
      script = '$(".geometry-picker.g-polygons").click();'
      page.execute_script script

      within first('.multiple.g-polygons .boundary .multiple.points') do
        fill_in 'Latitude', with: '0.1'
        fill_in 'Longitude', with: '0.1'

        click_on 'Add another Point'
        within '.multiple-item-1' do
          fill_in 'Latitude', with: '10.2'
          fill_in 'Longitude', with: '10.2'
        end

        click_on 'Add another Point'
        within '.multiple-item-2' do
          fill_in 'Latitude', with: '10.3'
          fill_in 'Longitude', with: '20.3'
        end

        click_on 'Add another Point'
        within '.multiple-item-3' do
          fill_in 'Latitude', with: '0.1'
          fill_in 'Longitude', with: '0.1'
        end
      end
    end

    it 'generates a link to Earthdata Search' do
      expect(page).to have_link('Preview on Map', href: polygon_link)
    end

    context 'when clicking "Add another Polygon"' do
      before do
        within first('.multiple.g-polygons') do
          click_on 'Add another G Polygon'
        end
      end

      it 'resets the preview url in the new accordion' do
        within first('.multiple.g-polygons > .multiple-item-1') do
          expect(page).to have_no_link('Preview on Map', href: polygon_link)
          expect(page).to have_link('Preview on Map', href: base_link)
        end
      end

      context 'when saving and reloading the page' do
        before do
          within '.nav-top' do
            click_on 'Save & Done'
          end
          # Accept
          click_on 'Yes'

          within '.metadata' do
            click_on 'Spatial Information'
          end

          open_accordions
        end

        it 'generates the link to Earthdata Search' do
          expect(page).to have_link('Preview on Map', href: polygon_link)
        end
      end
    end
  end
end
