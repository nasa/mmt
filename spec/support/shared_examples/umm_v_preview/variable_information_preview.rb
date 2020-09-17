shared_examples_for 'Variable Information Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within(first('.umm-preview.variable_information')) do
      within '#variable_draft_draft_name_preview, #variable_name_preview' do
        expect(page).to have_css('h5', text: 'Name')
        expect(page).to have_css('p', text: 'PNs_LIF')
      end

      within '#variable_draft_draft_long_name_preview, #variable_long_name_preview' do
        expect(page).to have_css('h5', text: 'Long Name')
        expect(page).to have_css('p', text: 'Volume mixing ratio of sum of peroxynitrates in air')
      end

      within '#variable_draft_draft_definition_preview, #variable_definition_preview' do
        expect(page).to have_css('h5', text: 'Definition')
        expect(page).to have_css('p', text: 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)')
      end

      within '#variable_draft_draft_standard_name_preview, #variable_standard_name_preview' do
        expect(page).to have_css('h5', text: 'Standard Name')
        expect(page).to have_css('p', text: 'Standard_Name_1')
      end

      within '#variable_draft_draft_additional_identifiers_preview, #variable_additional_identifiers_preview' do
        expect(page).to have_css('h5', text: 'Additional Identifiers')

        within '#variable_draft_draft_additional_identifiers_0_identifier_preview, #variable_additional_identifiers_0_identifier_preview' do
          expect(page).to have_css('h5', text: 'Identifier')
          expect(page).to have_css('p', text: 'Additional_Identifier_Identifier_1')
        end

        within '#variable_draft_draft_additional_identifiers_0_description_preview, #variable_additional_identifiers_0_description_preview' do
          expect(page).to have_css('h5', text: 'Description')
          expect(page).to have_css('p', text: 'No value for Description provided.')
        end

        within '#variable_draft_draft_additional_identifiers_1_identifier_preview, #variable_additional_identifiers_1_identifier_preview' do
          expect(page).to have_css('h5', text: 'Identifier')
          expect(page).to have_css('p', text: 'Additional_Identifier_Identifier_2')
        end

        within '#variable_draft_draft_additional_identifiers_1_description_preview, #variable_additional_identifiers_1_description_preview' do
          expect(page).to have_css('h5', text: 'Description')
          expect(page).to have_css('p', text: 'Additional_Identifier_Description_2')
        end
      end

      within '#variable_draft_draft_variable_type_preview, #variable_variable_type_preview' do
        expect(page).to have_css('h5', text: 'Variable Type')
        expect(page).to have_css('p', text: 'SCIENCE_VARIABLE')
      end

      within '#variable_draft_draft_variable_sub_type_preview, #variable_variable_sub_type_preview' do
        expect(page).to have_css('h5', text: 'Variable Sub Type')
        expect(page).to have_css('p', text: 'SCIENCE_SCALAR')
      end

      within '#variable_draft_draft_units_preview, #variable_units_preview' do
        expect(page).to have_css('h5', text: 'Units')
        expect(page).to have_css('p', text: 'Npptv')
      end

      within '#variable_draft_draft_data_type_preview, #variable_data_type_preview' do
        expect(page).to have_css('h5', text: 'Data Type')
        expect(page).to have_css('p', text: 'float')
      end

      within '#variable_draft_draft_scale_preview, #variable_scale_preview' do
        expect(page).to have_css('h5', text: 'Scale')
        expect(page).to have_css('p', text: '1.0')
      end

      within '#variable_draft_draft_offset_preview, #variable_offset_preview' do
        expect(page).to have_css('h5', text: 'Offset')
        expect(page).to have_css('p', text: '0.0')
      end

      within '#variable_draft_draft_valid_ranges_preview, #variable_valid_ranges_preview' do
        expect(page).to have_css('h5', text: 'Valid Ranges')
        expect(page).to have_css('h6', text: 'Valid Range 1')

        within '#variable_draft_draft_valid_ranges_0_min_preview, #variable_valid_ranges_0_min_preview' do
          expect(page).to have_css('h5', text: 'Min')
          expect(page).to have_css('p', text: '-417')
        end

        within '#variable_draft_draft_valid_ranges_0_max_preview, #variable_valid_ranges_0_max_preview' do
          expect(page).to have_css('h5', text: 'Max')
          expect(page).to have_css('p', text: '8836')
        end

        within '#variable_draft_draft_valid_ranges_0_code_system_identifier_meaning_preview, #variable_valid_ranges_0_code_system_identifier_meaning_preview' do
          expect(page).to have_css('h5', text: 'Code System Identifier Meaning')
          expect(page).to have_css('h6', text: 'Code System Identifier Meaning 1')
          expect(page).to have_css('h6', text: 'Code System Identifier Meaning 2')
        end

        within '#variable_draft_draft_valid_ranges_0_code_system_identifier_value_preview, #variable_valid_ranges_0_code_system_identifier_value_preview' do
          expect(page).to have_css('h5', text: 'Code System Identifier Value')
          expect(page).to have_css('h6', text: 'Code System Identifier Value 1')
          expect(page).to have_css('h6', text: 'Code System Identifier Value 2')
          expect(page).to have_css('h6', text: 'Code System Identifier Value 3')
        end

        expect(page).to have_css('h6', text: 'Valid Range 2')

        within '#variable_draft_draft_valid_ranges_1_min_preview, #variable_valid_ranges_1_min_preview' do
          expect(page).to have_css('h5', text: 'Min')
          expect(page).to have_css('p', text: '0.0')
        end

        within '#variable_draft_draft_valid_ranges_1_max_preview, #variable_valid_ranges_1_max_preview' do
          expect(page).to have_css('h5', text: 'Max')
          expect(page).to have_css('p', text: '1.0')
        end

        within '#variable_draft_draft_valid_ranges_1_code_system_identifier_meaning_preview, #variable_valid_ranges_1_code_system_identifier_meaning_preview' do
          expect(page).to have_css('h5', text: 'Code System Identifier Meaning')
          expect(page).to have_css('h6', text: 'Code System Identifier Meaning 1')
          expect(page).to have_css('h6', text: 'Code System Identifier Meaning 2')
          expect(page).to have_css('h6', text: 'Code System Identifier Meaning 3')
        end

        within '#variable_draft_draft_valid_ranges_1_code_system_identifier_value_preview, #variable_valid_ranges_1_code_system_identifier_value_preview' do
          expect(page).to have_css('h5', text: 'Code System Identifier Value')
          expect(page).to have_css('h6', text: 'Code System Identifier Value 1')
          expect(page).to have_css('h6', text: 'Code System Identifier Value 2')
        end
      end
    end
  end
end
