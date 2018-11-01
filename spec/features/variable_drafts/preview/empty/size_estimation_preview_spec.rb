describe 'Empty Variable Draft Size Estimation Preview' do
  before do
    login
    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Size Estimation section' do
    it 'displays the form title as an edit link' do
      within '#size_estimation-progress' do
        expect(page).to have_link('Size Estimation', href: edit_variable_draft_path(@draft, 'size_estimation'))
      end
    end

    it 'displays the current status icon' do
      within '#size_estimation-progress .status' do
        expect(page).to have_content('Size Estimation is valid')
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#size_estimation-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#size_estimation-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.size-estimation')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.size_estimation' do
        expect(page).to have_css('.umm-preview-field-container', count: 3)

        within '#variable_draft_draft_size_estimation_average_size_of_granules_sampled_preview' do
          expect(page).to have_css('h5', text: 'Average Size Of Granules Sampled')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'size_estimation', anchor: 'variable_draft_draft_size_estimation_average_size_of_granules_sampled'))
          expect(page).to have_css('p', text: 'No value for Average Size Of Granules Sampled provided.')
        end

        within '#variable_draft_draft_size_estimation_avg_compression_rate_ascii_preview' do
          expect(page).to have_css('h5', text: 'Avg Compression Rate ASCII')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'size_estimation', anchor: 'variable_draft_draft_size_estimation_avg_compression_rate_ascii'))
          expect(page).to have_css('p', text: 'No value for Avg Compression Rate ASCII provided.')
        end

        within '#variable_draft_draft_size_estimation_avg_compression_rate_net_cdf4_preview' do
          expect(page).to have_css('h5', text: 'Avg Compression Rate NetCDF4')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'size_estimation', anchor: 'variable_draft_draft_size_estimation_avg_compression_rate_net_cdf4'))
          expect(page).to have_css('p', text: 'No value for Avg Compression Rate NetCDF4 provided.')
        end
      end
    end
  end
end
