shared_examples_for 'Variable Fill Value Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.fill_values' do
      within '#variable_draft_draft_fill_values_preview, #variable_fill_values_preview' do
        expect(page).to have_css('h6', text: 'Fill Value 1')

        within '#variable_draft_draft_fill_values_0_value_preview, #variable_fill_values_0_value_preview' do
          expect(page).to have_css('h5', text: 'Value')
          expect(page).to have_css('p', text: '-9999.0')
        end

        within '#variable_draft_draft_fill_values_0_type_preview, #variable_fill_values_0_type_preview' do
          expect(page).to have_css('h5', text: 'Type')
          expect(page).to have_css('p', text: 'SCIENCE_FILLVALUE')
        end

        within '#variable_draft_draft_fill_values_0_description_preview, #variable_fill_values_0_description_preview' do
          expect(page).to have_css('h5', text: 'Description')
          expect(page).to have_css('p', text: 'Pellentesque Bibendum Commodo Fringilla Nullam')
        end

        expect(page).to have_css('h6', text: 'Fill Value 2')

        within '#variable_draft_draft_fill_values_1_value_preview, #variable_fill_values_1_value_preview' do
          expect(page).to have_css('h5', text: 'Value')
          expect(page).to have_css('p', text: '111.0')
        end

        within '#variable_draft_draft_fill_values_1_type_preview, #variable_fill_values_1_type_preview' do
          expect(page).to have_css('h5', text: 'Type')
          expect(page).to have_css('p', text: 'ANCILLARY_FILLVALUE')
        end

        within '#variable_draft_draft_fill_values_1_description_preview, #variable_fill_values_1_description_preview' do
          expect(page).to have_css('h5', text: 'Description')
          expect(page).to have_css('p', text: 'Pellentesque Nullam Ullamcorper Magna')
        end
      end
    end
  end
end
