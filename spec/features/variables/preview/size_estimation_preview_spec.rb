describe 'Valid Variable Size Estimation Preview', reset_provider: true do
  before do
    login
    ingest_collection_response, _collection_concept_response = publish_collection_draft
    ingest_response, _concept_response = publish_variable_draft(collection_concept_id: ingest_collection_response['concept-id'])
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Size Estimation section' do
    it 'displays the stored values correctly within the preview' do

      within '.umm-preview.size_estimation' do
        expect(page).to have_css('.umm-preview-field-container', count: 6)

        within '#variable_size_estimation_average_size_of_granules_sampled_preview' do
          expect(page).to have_css('h5', text: 'Average Size Of Granules Sampled')
          expect(page).to have_css('p', text: '3009960')
        end

        within '#variable_size_estimation_average_compression_information_0_rate_preview' do
          expect(page).to have_css('h5', text: 'Rate')
          expect(page).to have_css('p', text: '4.0')
        end
        within '#variable_size_estimation_average_compression_information_0_format_preview' do
          expect(page).to have_css('h5', text: 'Format')
          expect(page).to have_css('p', text: 'ASCII')
        end

        within '#variable_size_estimation_average_compression_information_1_rate_preview' do
          expect(page).to have_css('h5', text: 'Rate')
          expect(page).to have_css('p', text: '0.132')
        end

        within '#variable_size_estimation_average_compression_information_1_format_preview' do
          expect(page).to have_css('h5', text: 'Format')
          expect(page).to have_css('p', text: 'NetCDF-4')
        end
      end
    end
  end
end
