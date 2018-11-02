describe 'Valid Variable Measurement Identifiers Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Measurement Identifiers section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.measurement_identifiers' do
        expect(page).to have_css('.umm-preview-field-container', count: 10)

        within '#variable_measurement_identifiers_preview' do
          expect(page).to have_css('h6', text: 'Measurement Identifier 1')

          within '#variable_measurement_identifiers_0_measurement_name_measurement_object_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object')
            expect(page).to have_css('p', text: 'Standard Pressure')
          end

          within '#variable_measurement_identifiers_0_measurement_name_measurement_quantity_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity')
            expect(page).to have_css('p', text:'At Top Of Atmosphere')
          end

          within '#variable_measurement_identifiers_0_measurement_source_preview' do
            expect(page).to have_css('h5', text: 'Measurement Source')
            expect(page).to have_css('p', text: 'BODC')
          end

          expect(page).to have_css('h6', text: 'Measurement Identifier 2')

          within '#variable_measurement_identifiers_1_measurement_name_measurement_object_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object')
            expect(page).to have_css('p', text: 'Entropy')
          end

          within '#variable_measurement_identifiers_1_measurement_name_measurement_quantity_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity')
            expect(page).to have_css('p', text: 'At Top Of Atmosphere')
          end

          within '#variable_measurement_identifiers_1_measurement_source_preview' do
            expect(page).to have_css('h5', text: 'Measurement Source')
            expect(page).to have_css('p', text: 'CF')
          end

          expect(page).to have_css('h6', text: 'Measurement Identifier 3')

          within '#variable_measurement_identifiers_2_measurement_name_measurement_object_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object')
            expect(page).to have_css('p', text: 'Standard Temperature')
          end

          within '#variable_measurement_identifiers_2_measurement_name_measurement_quantity_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity')
            expect(page).to have_css('p', text: 'At Top Of Atmosphere')
          end

          within '#variable_measurement_identifiers_2_measurement_source_preview' do
            expect(page).to have_css('h5', text: 'Measurement Source')
            expect(page).to have_css('p', text: 'CSDMS')
          end
        end
      end
    end
  end
end