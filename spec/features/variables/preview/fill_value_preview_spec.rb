describe 'Valid Variable Fill Value Preview', reset_provider: true do
  before do
    login
    ingest_collection_response, _collection_concept_response = publish_collection_draft
    ingest_response, _concept_response = publish_variable_draft(collection_concept_id: ingest_collection_response['concept-id'])
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Fill Value section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.fill_values' do
        expect(page).to have_css('.umm-preview-field-container', count: 7)

        within '#variable_fill_values_preview' do
          expect(page).to have_css('h6', text: 'Fill Value 1')

          within '#variable_fill_values_0_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: '-9999.0')
          end

          within '#variable_fill_values_0_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_css('p', text: 'SCIENCE_FILLVALUE')
          end

          within '#variable_fill_values_0_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_css('p', text: 'Pellentesque Bibendum Commodo Fringilla Nullam')
          end

          expect(page).to have_css('h6', text: 'Fill Value 2')

          within '#variable_fill_values_1_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: '111.0')
          end

          within '#variable_fill_values_1_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_css('p', text: 'ANCILLARY_FILLVALUE')
          end

          within '#variable_fill_values_1_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_css('p', text: 'Pellentesque Nullam Ullamcorper Magna')
          end
        end
      end
    end
  end
end
