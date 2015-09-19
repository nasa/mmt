# MMT-35

require 'rails_helper'

describe 'Shapefile upload', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
    within '.metadata' do
      click_on 'Spatial Extent'
    end
    choose 'draft_spatial_extent_spatial_coverage_type_HORIZONTAL'
  end

  context 'when uploading a shapefile containing a single feature' do
    before do
      VCR.use_cassette('shapefiles/simple') do
        upload_shapefile('doc/example-data/shapefiles/simple.geojson')
      end
      open_accordions
    end

    it 'populates the form fields with the shapefile values' do
      within '.multiple.g-polygons > .multiple-item-0' do
        within '.boundary .multiple.points' do
          expect(page).to have_field('Longitude', with: '100')
          expect(page).to have_field('Latitude', with: '0')
          within '.multiple-item-1' do
            expect(page).to have_field('Longitude', with: '101')
            expect(page).to have_field('Latitude', with: '0')
          end
          within '.multiple-item-2' do
            expect(page).to have_field('Longitude', with: '101')
            expect(page).to have_field('Latitude', with: '1')
          end
          within '.multiple-item-3' do
            expect(page).to have_field('Longitude', with: '100')
            expect(page).to have_field('Latitude', with: '1')
          end
          within '.multiple-item-4' do
            expect(page).to have_field('Longitude', with: '100')
            expect(page).to have_field('Latitude', with: '0')
          end
        end
      end
    end
  end

  context 'when uploading a complex shapefile' do
    before do
      VCR.use_cassette('shapefiles/complex') do
        upload_shapefile('doc/example-data/shapefiles/complex.geojson')
      end
      open_accordions
    end

    it 'populates the form fields with the shapefile values' do
      within first('.multiple.points') do
        expect(page).to have_field('Longitude', with: '102')
        expect(page).to have_field('Latitude', with: '0.5')
      end

      within '.multiple.g-polygons > .multiple-item-0' do
        within '.boundary .multiple.points' do
          expect(page).to have_field('Longitude', with: '100')
          expect(page).to have_field('Latitude', with: '0')
          within '.multiple-item-1' do
            expect(page).to have_field('Longitude', with: '101')
            expect(page).to have_field('Latitude', with: '0')
          end
          within '.multiple-item-2' do
            expect(page).to have_field('Longitude', with: '101')
            expect(page).to have_field('Latitude', with: '1')
          end
          within '.multiple-item-3' do
            expect(page).to have_field('Longitude', with: '100')
            expect(page).to have_field('Latitude', with: '1')
          end
          within '.multiple-item-4' do
            expect(page).to have_field('Longitude', with: '100')
            expect(page).to have_field('Latitude', with: '0')
          end
        end
      end
    end
  end
end
