shared_examples_for 'Variable Sets Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.sets' do
      within '#variable_draft_draft_sets_preview, #variable_sets_preview' do
        expect(page).to have_css('h6', text: 'Set 1')

        within '#variable_draft_draft_sets_0_name_preview, #variable_sets_0_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_css('p', text: 'Science')
        end

        within '#variable_draft_draft_sets_0_type_preview, #variable_sets_0_type_preview' do
          expect(page).to have_css('h5', text: 'Type')
          expect(page).to have_css('p', text: 'Land')
        end

        within '#variable_draft_draft_sets_0_size_preview, #variable_sets_0_size_preview' do
          expect(page).to have_css('h5', text: 'Size')
          expect(page).to have_css('p', text: '50')
        end

        within '#variable_draft_draft_sets_0_index_preview, #variable_sets_0_index_preview' do
          expect(page).to have_css('h5', text: 'Index')
          expect(page).to have_css('p', text: '1')
        end

        expect(page).to have_css('h6', text: 'Set 2')

        within '#variable_draft_draft_sets_1_name_preview, #variable_sets_1_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_css('p', text: 'Fiction')
        end

        within '#variable_draft_draft_sets_1_type_preview, #variable_sets_1_type_preview' do
          expect(page).to have_css('h5', text: 'Type')
          expect(page).to have_css('p', text: 'Water')
        end

        within '#variable_draft_draft_sets_1_size_preview, #variable_sets_1_size_preview' do
          expect(page).to have_css('h5', text: 'Size')
          expect(page).to have_css('p', text: '100')
        end

        within '#variable_draft_draft_sets_1_index_preview, #variable_sets_1_index_preview' do
          expect(page).to have_css('h5', text: 'Index')
          expect(page).to have_css('p', text: '2')
        end
      end
    end
  end
end
