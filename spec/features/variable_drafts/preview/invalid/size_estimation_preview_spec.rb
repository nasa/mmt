describe 'Invalid Variable Size Estimation Preview' do
  before do
    login
    @draft = create(:invalid_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Size Estimation section' do
    it 'displays the form title as an edit link' do
      within '#size_estimation-progress' do
        expect(page).to have_link('Size Estimation', href: edit_variable_draft_path(@draft, 'size_estimation'))
      end
    end

    it 'displays the correct status icon' do
      within '#size_estimation-progress > div.status' do
        expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#size_estimation-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required-o.icon-green')
      end
    end

    it 'displays no progress indicators for non required fields' do
      within '#size_estimation-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-fa-circle.icon-grey')
      end
    end

    it 'displays the correct progress indicators for invalid fields' do
      within '#size_estimation-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.size-estimation')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.size_estimation' do
        expect(page).to have_css('.umm-preview-field-container', count: 6)

        within '#variable_draft_draft_size_estimation_average_size_of_granules_sampled_preview' do
          expect(page).to have_css('h5', text: 'Average Size Of Granules Sampled')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'size_estimation', anchor: 'variable_draft_draft_size_estimation_average_size_of_granules_sampled'))
          expect(page).to have_css('p', text: 'string')
        end

        within '#variable_draft_draft_size_estimation_average_compression_information_0_rate_preview' do
          expect(page).to have_css('h5', text: 'Rate')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'size_estimation', anchor: 'variable_draft_draft_size_estimation_average_compression_information_0_rate'))
          expect(page).to have_css('p', text: 'string')
        end

        within '#variable_draft_draft_size_estimation_average_compression_information_0_format_preview' do
          expect(page).to have_css('h5', text: 'Format')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'size_estimation', anchor: 'variable_draft_draft_size_estimation_average_compression_information_0_format'))
          expect(page).to have_css('p', text: 'ASCII')
        end

        within '#variable_draft_draft_size_estimation_average_compression_information_1_rate_preview' do
          expect(page).to have_css('h5', text: 'Rate')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'size_estimation', anchor: 'variable_draft_draft_size_estimation_average_compression_information_1_rate'))
          expect(page).to have_css('p', text: '15')
        end

        within '#variable_draft_draft_size_estimation_average_compression_information_1_format_preview' do
          expect(page).to have_css('h5', text: 'Format')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'size_estimation', anchor: 'variable_draft_draft_size_estimation_average_compression_information_1_format'))
          expect(page).to have_css('p', text: 'NetCDF-4')
        end

      end
    end
  end
end
