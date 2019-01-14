describe 'Shapefile upload', js: true do
  before do
    login

    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)

    visit edit_collection_draft_path(draft, form: 'spatial_information')

    open_accordions

    select 'Horizontal', from: 'Spatial Coverage Type'
  end

  context 'when uploading a shapefile containing a single feature' do
    before do
      VCR.use_cassette('shapefile_uploads/single', record: :none) do
        data_path = 'doc/example-data/shapefiles/simple.geojson'
        # Set ID for tests and remove styles that hide the input
        script = "$('.dz-hidden-input').attr('id', 'shapefile').attr('style', '');"
        page.execute_script(script)

        attach_file('shapefile', Rails.root.join(data_path))

        wait_for_jQuery

        # uploaded icon appears after the upload has happened, and we only want
        # to open_accordions after
        expect(page).to have_css('.dz-file-preview.dz-complete')
        open_accordions
      end
    end

    it 'populates the form fields with the simple shapefile values' do
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
      VCR.use_cassette('shapefile_uploads/complex', record: :none) do
        data_path = 'doc/example-data/shapefiles/complex.geojson'
        # Set ID for tests and remove styles that hide the input
        script = "$('.dz-hidden-input').attr('id', 'shapefile').attr('style', '');"
        page.execute_script(script)

        attach_file('shapefile', Rails.root.join(data_path))

        wait_for_jQuery

        # uploaded icon appears after the upload has happened, and we only want
        # to open_accordions after
        expect(page).to have_css('.dz-file-preview.dz-complete')
        open_accordions
      end
    end

    it 'populates the form fields with the complex shapefile values' do
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
