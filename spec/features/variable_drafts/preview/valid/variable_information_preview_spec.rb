describe 'Valid Variable Draft Variable Information Preview' do
  before do
    login
    @draft = create(:full_variable_draft, draft_entry_title: 'Volume mixing ratio of sum of peroxynitrates in air', draft_short_name: 'PNs_LIF', user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Variable Information section' do
    it 'displays the form title as an edit link' do
      within '#variable_information-progress' do
        expect(page).to have_link('Variable Information', href: edit_variable_draft_path(@draft, 'variable_information'))
      end
    end

    it 'displays the correct status icon' do
      within '#variable_information-progress' do
        within '.status' do
          expect(page).to have_content('Variable Information is valid')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#variable_information-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required.icon-green.name')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.definition')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.long-name')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.data-type')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.scale')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.offset')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#variable_information-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.variable-type')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.units')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.valid-ranges')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.variable_information' do
        expect(page).to have_css('.umm-preview-field-container', count: 20)

        within '#variable_draft_draft_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_name'))

          expect(page).to have_css('p', text: 'PNs_LIF')
        end

        within '#variable_draft_draft_alias_preview' do
          expect(page).to have_css('h5', text: 'Alias')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_alias'))

          expect(page).to have_css('p', text: 'An Alias')
        end

        within '#variable_draft_draft_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_long_name'))

          expect(page).to have_css('p', text: 'Volume mixing ratio of sum of peroxynitrates in air')
        end

        within '#variable_draft_draft_definition_preview' do
          expect(page).to have_css('h5', text: 'Definition')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_definition'))

          expect(page).to have_css('p', text: 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)')
        end

        within '#variable_draft_draft_variable_type_preview' do
          expect(page).to have_css('h5', text: 'Variable Type')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_variable_type'))

          expect(page).to have_css('p', text: 'SCIENCE_VARIABLE')
        end

        within '#variable_draft_draft_variable_sub_type_preview' do
          expect(page).to have_css('h5', text: 'Variable Sub Type')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_variable_sub_type'))

          expect(page).to have_css('p', text: 'SCIENCE_SCALAR')
        end

        within '#variable_draft_draft_units_preview' do
          expect(page).to have_css('h5', text: 'Units')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_units'))

          expect(page).to have_css('p', text: 'Npptv')
        end

        within '#variable_draft_draft_data_type_preview' do
          expect(page).to have_css('h5', text: 'Data Type')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_data_type'))

          expect(page).to have_css('p', text: 'float')
        end

        within '#variable_draft_draft_scale_preview' do
          expect(page).to have_css('h5', text: 'Scale')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_scale'))

          expect(page).to have_css('p', text: '1.0')
        end

        within '#variable_draft_draft_offset_preview' do
          expect(page).to have_css('h5', text: 'Offset')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_offset'))

          expect(page).to have_css('p', text: '0.0')
        end

        within '#variable_draft_draft_acquisition_source_name_preview' do
          expect(page).to have_css('h5', text: 'Acquisition Source Name')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_acquisition_source_name'))
          expect(page).to have_css('p', text: 'ATM')
        end

        within '#variable_draft_draft_valid_ranges_preview' do
          expect(page).to have_css('h5', text: 'Valid Ranges')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges'))

          expect(page).to have_css('h6', text: 'Valid Range 1')

          within '#variable_draft_draft_valid_ranges_0_min_preview' do
            expect(page).to have_css('h5', text: 'Min')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_min'))
            expect(page).to have_css('p', text: '-417')
          end

          within '#variable_draft_draft_valid_ranges_0_max_preview' do
            expect(page).to have_css('h5', text: 'Max')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_max'))
            expect(page).to have_css('p', text: '8836')
          end

          within '#variable_draft_draft_valid_ranges_0_code_system_identifier_meaning_preview' do
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_code_system_identifier_meaning'))
            expect(page).to have_css('h5', text: 'Code System Identifier Meaning')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 1')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 2')
          end

          within '#variable_draft_draft_valid_ranges_0_code_system_identifier_value_preview' do
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_code_system_identifier_value'))
            expect(page).to have_css('h5', text: 'Code System Identifier Value')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 1')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 2')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 3')
          end

          expect(page).to have_css('h6', text: 'Valid Range 2')

          within '#variable_draft_draft_valid_ranges_1_min_preview' do
            expect(page).to have_css('h5', text: 'Min')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_1_min'))
            expect(page).to have_css('p', text: '0.0')
          end

          within '#variable_draft_draft_valid_ranges_1_max_preview' do
            expect(page).to have_css('h5', text: 'Max')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_1_max'))
            expect(page).to have_css('p', text: '1.0')
          end

          within '#variable_draft_draft_valid_ranges_1_code_system_identifier_meaning_preview' do
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_1_code_system_identifier_meaning'))
            expect(page).to have_css('h5', text: 'Code System Identifier Meaning')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 1')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 2')
            expect(page).to have_css('h6', text: 'Code System Identifier Meaning 3')
          end

          within '#variable_draft_draft_valid_ranges_1_code_system_identifier_value_preview' do
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_1_code_system_identifier_value'))
            expect(page).to have_css('h5', text: 'Code System Identifier Value')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 1')
            expect(page).to have_css('h6', text: 'Code System Identifier Value 2')
          end

        end
      end
    end
  end
end
