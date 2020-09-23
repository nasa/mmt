shared_examples_for 'Variable Dimensions Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.dimensions' do
      expect(page).to have_css('.umm-preview-field-container', count: 7)

      within '#variable_draft_draft_dimensions_preview, #variable_dimensions_preview' do
        expect(page).to have_css('h6', text: 'Dimension 1')

        within '#variable_draft_draft_dimensions_0_name_preview, #variable_dimensions_0_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_css('p', text: 'LatDim')
        end

        within '#variable_draft_draft_dimensions_0_size_preview, #variable_dimensions_0_size_preview' do
          expect(page).to have_css('h5', text: 'Size')
          expect(page).to have_css('p', text: '36')
        end

        within '#variable_draft_draft_dimensions_0_type_preview, #variable_dimensions_0_type_preview' do
          expect(page).to have_css('h5', text: 'Type')
          expect(page).to have_css('p', text: 'LATITUDE_DIMENSION')
        end

        expect(page).to have_css('h6', text: 'Dimension 2')

        within '#variable_draft_draft_dimensions_1_name_preview, #variable_dimensions_1_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_css('p', text: 'Lizard Herp Doc Pop')
        end

        within '#variable_draft_draft_dimensions_1_size_preview, #variable_dimensions_1_size_preview' do
          expect(page).to have_css('h5', text: 'Size')
          expect(page).to have_css('p', text: '2020')
        end

        within '#variable_draft_draft_dimensions_1_type_preview, #variable_dimensions_1_type_preview' do
          expect(page).to have_css('h5', text: 'Type')
          expect(page).to have_css('p', text: 'LONGITUDE_DIMENSION')
        end
      end
    end
  end
end
