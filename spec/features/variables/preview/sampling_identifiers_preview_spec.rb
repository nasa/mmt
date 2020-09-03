describe 'Valid Variable Sampling Identifiers Preview', reset_provider: true do
  before do
    login
    ingest_collection_response, _collection_concept_response = publish_collection_draft
    ingest_response, _concept_response = publish_variable_draft(collection_concept_id: ingest_collection_response['concept-id'])
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Sampling Identifiers section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.sampling_identifiers' do
        expect(page).to have_css('.umm-preview-field-container', count: 7)

        within '#variable_sampling_identifiers_preview' do
          expect(page).to have_css('h6', text: 'Sampling Identifier 1')

          within '#variable_sampling_identifiers_0_sampling_method_preview' do
            expect(page).to have_css('h5', text: 'Sampling Method')
            expect(page).to have_css('p', text: 'Satellite overpass')
          end

          within '#variable_sampling_identifiers_0_measurement_conditions_preview' do
            expect(page).to have_css('h5', text: 'Measurement Conditions')
            expect(page).to have_css('p', text:'Measured at top of atmosphere (specifically at the top of the mesosphere, i.e. the mesopause).')
          end

          within '#variable_sampling_identifiers_0_reporting_conditions_preview' do
            expect(page).to have_css('h5', text: 'Reporting Conditions')
            expect(page).to have_css('p', text: 'At 50 km from the surface, pressure is 1MB and temperature is -130 degrees F.')
          end

          expect(page).to have_css('h6', text: 'Sampling Identifier 2')

          within '#variable_sampling_identifiers_1_sampling_method_preview' do
            expect(page).to have_css('h5', text: 'Sampling Method')
            expect(page).to have_css('p', text: 'Satellite overpass 1')
          end

          within '#variable_sampling_identifiers_1_measurement_conditions_preview' do
            expect(page).to have_css('h5', text: 'Measurement Conditions')
            expect(page).to have_css('p', text:'Measured at bottom of atmosphere')
          end

          within '#variable_sampling_identifiers_1_reporting_conditions_preview' do
            expect(page).to have_css('h5', text: 'Reporting Conditions')
            expect(page).to have_css('p', text: 'At 1 km from the surface, pressure is 1MB and temperature is 32 degrees F.')
          end

        end
      end
    end
  end
end
