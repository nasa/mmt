shared_examples_for 'Variable Measurement Identifiers Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.measurement_identifiers' do
      expect(page).to have_css('.umm-preview-field-container', count: 17)
      
      within '#variable_draft_draft_measurement_identifiers_preview, #variable_measurement_identifiers_preview' do
        expect(page).to have_css('h6', text: 'Measurement Identifier 1')

        within '#variable_draft_draft_measurement_identifiers_0_measurement_context_medium_preview, #variable_measurement_identifiers_0_measurement_context_medium_preview' do
          expect(page).to have_css('h5', text: 'Measurement Context Medium')
          expect(page).to have_css('p', text: 'ocean')
        end

        within '#variable_draft_draft_measurement_identifiers_0_measurement_context_medium_uri_preview, #variable_measurement_identifiers_0_measurement_context_medium_uri_preview' do
          expect(page).to have_css('h5', text: 'Measurement Context Medium Uri')
          expect(page).to have_css('p', text: 'ocean.gov')
        end

        within '#variable_draft_draft_measurement_identifiers_0_measurement_object_preview, #variable_measurement_identifiers_0_measurement_object_preview' do
          expect(page).to have_css('h5', text: 'Measurement Object')
          expect(page).to have_css('p', text: 'sea_ice')
        end

        within '#variable_draft_draft_measurement_identifiers_0_measurement_object_uri_preview, #variable_measurement_identifiers_0_measurement_object_uri_preview' do
          expect(page).to have_css('h5', text: 'Measurement Object Uri')
          expect(page).to have_css('p', text: 'sea-ice.ocean.gov')
        end

        expect(page).to have_css('h5', text: 'Measurement Quantities')

        within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_preview, #variable_measurement_identifiers_0_measurement_quantities_preview' do
          within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_value_preview, #variable_measurement_identifiers_0_measurement_quantities_0_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: 'albedo')
          end
          within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_measurement_quantity_uri_preview, #variable_measurement_identifiers_0_measurement_quantities_0_measurement_quantity_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
            expect(page).to have_css('p', text: 'sea-ice.ocean.gov/albedo')
          end
          within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_value_preview, #variable_measurement_identifiers_0_measurement_quantities_1_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: 'bottom_depth')
          end
          within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_measurement_quantity_uri_preview, #variable_measurement_identifiers_0_measurement_quantities_1_measurement_quantity_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
            expect(page).to have_css('p', text: 'No value for Measurement Quantity Uri provided')
          end
        end

        expect(page).to have_css('h6', text: 'Measurement Identifier 2')

        within '#variable_draft_draft_measurement_identifiers_1_measurement_context_medium_preview, #variable_measurement_identifiers_1_measurement_context_medium_preview' do
          expect(page).to have_css('h5', text: 'Measurement Context Medium')
          expect(page).to have_css('p', text: 'ocean')
        end

        within '#variable_draft_draft_measurement_identifiers_1_measurement_context_medium_uri_preview, #variable_measurement_identifiers_1_measurement_context_medium_uri_preview' do
          expect(page).to have_css('h5', text: 'Measurement Context Medium Uri')
          expect(page).to have_css('p', text: 'No value for Measurement Context Medium Uri provided')
        end

        within '#variable_draft_draft_measurement_identifiers_1_measurement_object_preview, #variable_measurement_identifiers_1_measurement_object_preview' do
          expect(page).to have_css('h5', text: 'Measurement Object')
          expect(page).to have_css('p', text: 'sea_ice-meltwater')
        end

        within '#variable_draft_draft_measurement_identifiers_1_measurement_object_uri_preview, #variable_measurement_identifiers_1_measurement_object_uri_preview' do
          expect(page).to have_css('h5', text: 'Measurement Object Uri')
          expect(page).to have_css('p', text: 'No value for Measurement Object Uri provided')
        end

        within '#variable_draft_draft_measurement_identifiers_1_measurement_quantities_preview, #variable_measurement_identifiers_1_measurement_quantities_preview' do
          within '#variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_value_preview, #variable_measurement_identifiers_1_measurement_quantities_0_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: 'volume')
          end
          within '#variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_measurement_quantity_uri_preview, #variable_measurement_identifiers_1_measurement_quantities_0_measurement_quantity_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
            expect(page).to have_css('p', text: 'No value for Measurement Quantity Uri provided')
          end
        end
      end
    end
  end
end
