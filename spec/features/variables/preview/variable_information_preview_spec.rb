describe 'Valid Variable Variable Information Preview', reset_provider: true do
  before do
    login
    collection_ingest_response, _collection_concept_response = publish_collection_draft
    ingest_response, _concept_response = publish_variable_draft(name: 'PNs_LIF', long_name: 'Volume mixing ratio of sum of peroxynitrates in air', collection_concept_id: collection_ingest_response['concept-id'])
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Variable Information section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.variable_information' do
        expect(page).to have_css('.umm-preview-field-container', count: 20)

        within '#variable_name_preview' do
          expect(page).to have_css('h5', text: 'Name')

          expect(page).to have_css('p', text: 'PNs_LIF')
        end

        within '#variable_alias_preview' do
          expect(page).to have_css('h5', text: 'Alias')

          expect(page).to have_css('p', text: 'An Alias')
        end

        within '#variable_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')

          expect(page).to have_css('p', text: 'Volume mixing ratio of sum of peroxynitrates in air')
        end

        within '#variable_definition_preview' do
          expect(page).to have_css('h5', text: 'Definition')

          expect(page).to have_css('p', text: 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)')
        end

        within '#variable_variable_type_preview' do
          expect(page).to have_css('h5', text: 'Variable Type')

          expect(page).to have_css('p', text: 'SCIENCE_VARIABLE')
        end

        within '#variable_variable_sub_type_preview' do
          expect(page).to have_css('h5', text: 'Variable Sub Type')

          expect(page).to have_css('p', text: 'SCIENCE_SCALAR')
        end

        within '#variable_units_preview' do
          expect(page).to have_css('h5', text: 'Units')

          expect(page).to have_css('p', text: 'Npptv')
        end

        within '#variable_data_type_preview' do
          expect(page).to have_css('h5', text: 'Data Type')

          expect(page).to have_css('p', text: 'float')
        end

        within '#variable_scale_preview' do
          expect(page).to have_css('h5', text: 'Scale')

          expect(page).to have_css('p', text: '1.0')
        end

        within '#variable_offset_preview' do
          expect(page).to have_css('h5', text: 'Offset')

          expect(page).to have_css('p', text: '0.0')
        end

        within '#variable_acquisition_source_name_preview' do
          expect(page).to have_css('h5', text: 'Acquisition Source Name')
          expect(page).to have_css('p', text: 'ATM')
        end

        within '#variable_valid_ranges_preview' do
          expect(page).to have_css('h5', text: 'Valid Range')

          expect(page).to have_css('h6', text: 'Valid Range 1')

          within '#variable_valid_ranges_0_min_preview' do
            expect(page).to have_css('h5', text: 'Min')
            expect(page).to have_css('p', text: '-417')
          end

          within '#variable_valid_ranges_0_max_preview' do
            expect(page).to have_css('h5', text: 'Max')
            expect(page).to have_css('p', text: '8836')
          end

          within '#variable_valid_ranges_0_code_system_identifier_meaning_preview' do
            expect(page).to have_css('h5', text: 'Code System Identifier Meaning')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 1')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 2')
          end

          within '#variable_valid_ranges_0_code_system_identifier_value_preview' do
            expect(page).to have_css('h5', text: 'Code System Identifier Value')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 1')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 2')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 3')
          end

          expect(page).to have_css('h6', text: 'Valid Range 2')

          within '#variable_valid_ranges_1_min_preview' do
            expect(page).to have_css('h5', text: 'Min')
            expect(page).to have_css('p', text: '0.0')
          end

          within '#variable_valid_ranges_1_max_preview' do
            expect(page).to have_css('h5', text: 'Max')
            expect(page).to have_css('p', text: '1.0')
          end

          within '#variable_valid_ranges_1_code_system_identifier_meaning_preview' do
            expect(page).to have_css('h5', text: 'Code System Identifier Meaning')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 1')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 2')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 3')
          end

          within '#variable_valid_ranges_1_code_system_identifier_value_preview' do
            expect(page).to have_css('h5', text: 'Code System Identifier Value')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 1')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 2')
          end

        end
      end
    end
  end
end
