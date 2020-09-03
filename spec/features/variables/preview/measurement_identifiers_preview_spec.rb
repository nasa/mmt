describe 'Valid Variable Measurement Identifiers Preview', reset_provider: true do
  before do
    login
    ingest_collection_response, _collection_concept_response = publish_collection_draft
    ingest_response, _concept_response = publish_variable_draft(collection_concept_id: ingest_collection_response['concept-id'])
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Measurement Identifiers section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.measurement_identifiers' do
        expect(page).to have_css('h6', text: 'Measurement Identifier 1')

        within '#variable_measurement_identifiers_0_measurement_context_medium_preview' do
          expect(page).to have_css('h5', text: 'Measurement Context Medium')
          expect(page).to have_css('p', text: 'ocean')
        end

        within '#variable_measurement_identifiers_0_measurement_context_medium_uri_preview' do
          expect(page).to have_css('h5', text: 'Measurement Context Medium Uri')
          expect(page).to have_css('p', text: 'fake.website.gov')
        end

        within '#variable_measurement_identifiers_0_measurement_object_preview' do
          expect(page).to have_css('h5', text: 'Measurement Object')
          expect(page).to have_css('p', text: 'sea_ice-meltwater')
        end

        within '#variable_measurement_identifiers_0_measurement_object_uri_preview' do
          expect(page).to have_css('h5', text: 'Measurement Object Uri')
          expect(page).to have_css('p', text: 'fake.website.gov')
        end

        expect(page).to have_css('h5', text: 'Measurement Quantities')

        within '#variable_measurement_identifiers_0_measurement_quantities_preview' do
          within '#variable_measurement_identifiers_0_measurement_quantities_0_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: 'volume')
          end
          within '#variable_measurement_identifiers_0_measurement_quantities_0_measurement_quantity_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
            expect(page).to have_css('p', text: 'fake.website.gov')
          end
          within '#variable_measurement_identifiers_0_measurement_quantities_1_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: 'volume')
          end
          within '#variable_measurement_identifiers_0_measurement_quantities_1_measurement_quantity_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
            expect(page).to have_css('p', text: 'No value for Measurement Quantity Uri provided')
          end
        end

        expect(page).to have_css('h6', text: 'Measurement Identifier 2')

        within '#variable_measurement_identifiers_1_measurement_context_medium_preview' do
          expect(page).to have_css('h5', text: 'Measurement Context Medium')
          expect(page).to have_css('p', text: 'ocean')
        end

        within '#variable_measurement_identifiers_1_measurement_context_medium_uri_preview' do
          expect(page).to have_css('h5', text: 'Measurement Context Medium Uri')
          expect(page).to have_css('p', text: 'No value for Measurement Context Medium Uri provided')
        end

        within '#variable_measurement_identifiers_1_measurement_object_preview' do
          expect(page).to have_css('h5', text: 'Measurement Object')
          expect(page).to have_css('p', text: 'sea_ice-meltwater')
        end

        within '#variable_measurement_identifiers_1_measurement_object_uri_preview' do
          expect(page).to have_css('h5', text: 'Measurement Object Uri')
          expect(page).to have_css('p', text: 'No value for Measurement Object Uri provided')
        end

        within '#variable_measurement_identifiers_1_measurement_quantities_preview' do
          within '#variable_measurement_identifiers_1_measurement_quantities_0_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: 'volume')
          end
          within '#variable_measurement_identifiers_1_measurement_quantities_0_measurement_quantity_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
            expect(page).to have_css('p', text: 'No value for Measurement Quantity Uri provided')
          end
        end
      end
    end
  end
end
