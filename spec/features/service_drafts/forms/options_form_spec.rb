describe 'Service Drafts Options Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'options')
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Options')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Options')
      end
    end

    it 'displays the correct sections' do
      within '.umm-form' do
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Options')
      end
    end

    it 'does not display required icons for accordions on the Service Constraints form' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Supported Input Projection')
      expect(page).to have_selector(:link_or_button, 'Add another Supported Output Projection')
      expect(page).to have_selector(:link_or_button, 'Add another Supported Reformatting')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('service_draft_draft_service_options_supported_input_projections_0_projection_name', selected: ['Select a Projection Name'])
        expect(page).to have_select('service_draft_draft_service_options_supported_input_projections_0_projection_unit', selected: ['Select a Projection Unit'])
        expect(page).to have_select('service_draft_draft_service_options_supported_input_projections_0_projection_datum_name', selected: ['Select a Projection Datum Name'])
        expect(page).to have_select('service_draft_draft_service_options_supported_output_projections_0_projection_name', selected: ['Select a Projection Name'])
        expect(page).to have_select('service_draft_draft_service_options_supported_output_projections_0_projection_unit', selected: ['Select a Projection Unit'])
        expect(page).to have_select('service_draft_draft_service_options_supported_output_projections_0_projection_datum_name', selected: ['Select a Projection Datum Name'])
        expect(page).to have_select('service_draft_draft_service_options_supported_reformattings_0_supported_input_format', selected: ['Select a Supported Input Format'])
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '.subset' do
        check 'Spatial Subset'
        within '.spatial-subset-fields' do
          check 'Point'
          within '.point-fields' do
            choose 'False'
          end

          check 'Polygon'
          within '.polygon-fields' do
            fill_in 'Maximum Number Of Points', with: 20
            choose 'True'
          end

          check 'Shapefile'
          within '.shapefile-fields' do
            within '.multiple-item-0' do
              select 'ESRI', from: 'Format'
              fill_in 'Maximum File Size In Bytes', with: 400
            end

            click_on 'Add another Shapefile'

            within '.multiple-item-1' do
              select 'GeoJSON', from: 'Format'
            end
          end
        end
      end

      select 'ANOMOLY', from: 'Variable Aggregation Supported Methods'

      within '.supported-input-projections .multiple-item-0' do
        select 'Geographic', from: 'Projection Name'
        fill_in 'Projection Latitude Of Center', with: 10
        fill_in 'Projection Longitude Of Center', with: 10
        fill_in 'Projection False Easting', with: 10
        fill_in 'Projection False Northing', with: 10
        fill_in 'Projection Authority', with: '4326'
        select 'Degrees', from: 'Projection Unit'
        select 'World Geodetic System (WGS) 1984', from: 'Projection Datum Name'
      end

      within '.multiple.supported-output-projections' do
        within '.multiple-item-0' do
          select 'Geographic', from: 'Projection Name'
          fill_in 'Projection Latitude Of Center', with: 10
          fill_in 'Projection Longitude Of Center', with: 10
          fill_in 'Projection False Easting', with: 10
          fill_in 'Projection False Northing', with: 10
          fill_in 'Projection Authority', with: '4326'
          select 'Degrees', from: 'Projection Unit'
          select 'World Geodetic System (WGS) 1984', from: 'Projection Datum Name'
        end

        click_on 'Add another Supported Output Projection'

        within '.multiple-item-1' do
          select 'NAD83 / UTM zone 17N', from: 'Projection Name'
          fill_in 'Projection Latitude Of Center', with: 10
          fill_in 'Projection Longitude Of Center', with: 10
          fill_in 'Projection False Easting', with: 10
          fill_in 'Projection False Northing', with: 10
          fill_in 'Projection Authority', with: '26917'
          select 'Meters', from: 'Projection Unit'
          select 'North American Datum (NAD) 1983', from: 'Projection Datum Name'
        end
      end

      select 'Bilinear Interpolation', from: 'Interpolation Types'
      select 'Bicubic Interpolation', from: 'Interpolation Types'

      fill_in 'Max Granules', with: 50

      within '.supported-reformattings' do
        select 'HDF-EOS2', from: 'Supported Input Format'
        select 'HDF-EOS2', from: 'Supported Output Formats'
        select 'HDF-EOS', from: 'Supported Output Formats'
      end

      within '.subset' do
        # MMT-2428: we want to follow the steps in the ticket to try to recreate the error.
        # 1. Check both Temporal and Variable Subsets and select a boolean value for both
        # 2. Uncheck both, re-check them, and select a value for just one of them
        # 3. If the bug persists, both radio group labels (despite one of them not having a T/F selected)
        #    will have required icons, otherwise only the radio group with a selected button
        #    will have a required icon
        check 'Variable Subset'
        check 'Temporal Subset'

        within '.variable-subset-fields' do
          choose 'True'
        end
        within '.temporal-subset-fields' do
          choose 'True'
        end

        uncheck 'Temporal Subset'
        uncheck 'Variable Subset'
        check 'Variable Subset'
        check 'Temporal Subset'
        within '.variable-subset-fields' do
          choose 'True'
        end
      end
    end

    it 'does not erroneously display required icons for Subset child fields' do
      within '.variable-subset-fields' do
        expect(page).to have_css('label.eui-required-o')
      end
      within '.temporal-subset-fields' do
        expect(page).to have_no_css('label.eui-required-o')
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 7)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Service Draft Updated Successfully!')

        expect(page).to have_checked_field('Subset')
        within '.subset' do
          expect(page).to have_checked_field('Spatial Subset')
          within '.spatial-subset-fields' do
            expect(page).to have_checked_field('Point')
            within '.point-fields' do
              expect(page).to have_checked_field('False')
            end

            expect(page).to have_checked_field('Polygon')
            within '.polygon-fields' do
              expect(page).to have_field('Maximum Number Of Points', with: '20.0')
              expect(page).to have_checked_field('True')
            end

            expect(page).to have_checked_field('Shapefile')
            within '.shapefile-fields' do
              within '.multiple-item-0' do
                expect(page).to have_select('Format', selected: 'ESRI')
                expect(page).to have_field('Maximum File Size In Bytes', with: '400.0')
              end
              within '.multiple-item-1' do
                expect(page).to have_select('Format', selected: 'GeoJSON')
              end
            end
          end

          expect(page).to have_checked_field('Variable Subset')
          within '.variable-subset-fields' do
            expect(page).to have_checked_field('True')
          end
        end

        expect(page).to have_select('Variable Aggregation Supported Methods', selected: ['ANOMOLY'])

        within '.supported-input-projections .multiple-item-0' do
          expect(page).to have_field('Projection Name', with: 'Geographic')
          expect(page).to have_field('Projection Latitude Of Center', with: '10.0')
          expect(page).to have_field('Projection Longitude Of Center', with: '10.0')
          expect(page).to have_field('Projection False Easting', with: '10.0')
          expect(page).to have_field('Projection False Northing', with: '10.0')
          expect(page).to have_field('Projection Authority', with: '4326')
          expect(page).to have_field('Projection Unit', with: 'Degrees')
          expect(page).to have_field('Projection Datum Name', with: 'World Geodetic System (WGS) 1984')
        end
        within '.supported-output-projections .multiple-item-0' do
          expect(page).to have_field('Projection Name', with: 'Geographic')
          expect(page).to have_field('Projection Latitude Of Center', with: '10.0')
          expect(page).to have_field('Projection Longitude Of Center', with: '10.0')
          expect(page).to have_field('Projection False Easting', with: '10.0')
          expect(page).to have_field('Projection False Northing', with: '10.0')
          expect(page).to have_field('Projection Authority', with: '4326')
          expect(page).to have_field('Projection Unit', with: 'Degrees')
          expect(page).to have_field('Projection Datum Name', with: 'World Geodetic System (WGS) 1984')
        end
        within '.supported-output-projections .multiple-item-1' do
          expect(page).to have_field('Projection Name', with: 'NAD83 / UTM zone 17N')
          expect(page).to have_field('Projection Latitude Of Center', with: '10.0')
          expect(page).to have_field('Projection Longitude Of Center', with: '10.0')
          expect(page).to have_field('Projection False Easting', with: '10.0')
          expect(page).to have_field('Projection False Northing', with: '10.0')
          expect(page).to have_field('Projection Authority', with: '26917')
          expect(page).to have_field('Projection Unit', with: 'Meters')
          expect(page).to have_field('Projection Datum Name', with: 'North American Datum (NAD) 1983')
        end

        expect(page).to have_select('Interpolation Types', selected: ['Bilinear Interpolation', 'Bicubic Interpolation'])

        within '.supported-reformattings' do
          expect(page).to have_select('Supported Input Format', selected: 'HDF-EOS2')
          expect(page).to have_select('Supported Output Formats', selected: ['HDF-EOS2', 'HDF-EOS'])
        end

        expect(page).to have_field('Max Granules', with: '50.0')
      end
    end
  end
end
