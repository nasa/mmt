describe 'Valid Variable Size Estimation Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Size Estimation section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.size_estimation' do
        expect(page).to have_css('.umm-preview-field-container', count: 3)

        within '#variable_size_estimation_average_size_of_granules_sampled_preview' do
          expect(page).to have_css('h5', text: 'Average Size Of Granules Sampled')
          expect(page).to have_css('p', text: '3009960')
        end

        within '#variable_size_estimation_avg_compression_rate_ascii_preview' do
          expect(page).to have_css('h5', text: 'Avg Compression Rate ASCII')
          expect(page).to have_css('p', text: '4.0')
        end

        within '#variable_size_estimation_avg_compression_rate_net_cdf4_preview' do
          expect(page).to have_css('h5', text: 'Avg Compression Rate NetCDF4')
          expect(page).to have_css('p', text: '0.132')
        end

      end
    end
  end
end