shared_examples_for 'Variable Index Ranges Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview-sidebar' do
      within '.umm-preview.variable_information' do
        expect(page).to have_css('.umm-preview-field-container', count: 3)
        
        within '#variable_draft_draft_index_ranges_lat_range_preview, #variable_index_ranges_lat_range_preview' do
          expect(page).to have_css('h5', text: 'Lat Range')
          expect(page).to have_css('h6', text: 'Lat Range 1')
          expect(page).to have_css('p', text: '-90.0')
          expect(page).to have_css('h6', text: 'Lat Range 2')
          expect(page).to have_css('p', text: '90.0')
        end

        within '#variable_draft_draft_index_ranges_lon_range_preview, #variable_index_ranges_lon_range_preview' do
          expect(page).to have_css('h5', text: 'Lon Range')
          expect(page).to have_css('h6', text: 'Lon Range 1')
          expect(page).to have_css('p', text: '-180.0')
          expect(page).to have_css('h6', text: 'Lon Range 2')
          expect(page).to have_css('p', text: '180.0')
        end
      end
    end
  end
end
