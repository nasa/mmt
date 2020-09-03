describe 'Valid Variable Variable Characteristics Preview', reset_provider: true do
  before do
    login
    ingest_collection_response, _collection_concept_response = publish_collection_draft
    ingest_response, _concept_response = publish_variable_draft(collection_concept_id: ingest_collection_response['concept-id'])
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Variable Characteristics section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.variable_characteristics' do
        expect(page).to have_css('h4', text: 'Variable Characteristics')
        expect(page).to have_css('.umm-preview-field-container', count: 5)

        within '#variable_characteristics_index_ranges_lat_range_preview' do
          expect(page).to have_css('h5', text: 'Lat Range')
          expect(page).to have_css('h6', text: 'Lat Range 1')
          expect(page).to have_css('p', text: '-90.0')
          expect(page).to have_css('h6', text: 'Lat Range 2')
          expect(page).to have_css('p', text: '90.0')
        end

        within '#variable_characteristics_index_ranges_lon_range_preview' do
          expect(page).to have_css('h5', text: 'Lon Range')
          expect(page).to have_css('h6', text: 'Lon Range 1')
          expect(page).to have_css('p', text: '-180.0')
          expect(page).to have_css('h6', text: 'Lon Range 2')
          expect(page).to have_css('p', text: '180.0')
        end

        within '#variable_characteristics_group_path_preview' do
          expect(page).to have_css('h5', text: 'Group Path')
          expect(page).to have_css('p', text: '/Data_Fields/')
        end

      end
    end
  end
end
