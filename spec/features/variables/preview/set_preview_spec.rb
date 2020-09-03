describe 'Valid Variable Set Preview', reset_provider: true do
  before do
    login
    ingest_collection_response, _collection_concept_response = publish_collection_draft
    ingest_response, _concept_response = publish_variable_draft(collection_concept_id: ingest_collection_response['concept-id'])
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Set section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.sets' do
        expect(page).to have_css('.umm-preview-field-container', count: 9)

        within '#variable_sets_preview' do
          expect(page).to have_css('h6', text: 'Set 1')

          within '#variable_sets_0_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_css('p', text: 'Science')
          end

          within '#variable_sets_0_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_css('p', text: 'Land')
          end

          within '#variable_sets_0_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_css('p', text: '50')
          end

          within '#variable_sets_0_index_preview' do
            expect(page).to have_css('h5', text: 'Index')
            expect(page).to have_css('p', text: '1')
          end

          expect(page).to have_css('h6', text: 'Set 2')

          within '#variable_sets_1_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_css('p', text: 'Fiction')
          end

          within '#variable_sets_1_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_css('p', text: 'Water')
          end

          within '#variable_sets_1_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_css('p', text: '100')
          end

          within '#variable_sets_1_index_preview' do
            expect(page).to have_css('h5', text: 'Index')
            expect(page).to have_css('p', text: '2')
          end
        end
      end
    end
  end
end
