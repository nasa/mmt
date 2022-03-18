describe 'Variable Drafts Variable Information Form', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft)
  end

  context 'When viewing the form with no stored values' do
    before do
    end

    it 'displays required icons on the Variable Information accordion' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Variable Information')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('variable_draft_draft_variable_type', selected: 'Select a Variable Type')
        expect(page).to have_select('variable_draft_draft_data_type', selected: 'Select a Data Type')
      end
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Variable Information')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('Variable Information')
      end
    end

    it 'has 3 required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 3)
    end

    it 'displays buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Additional Identifier')
      expect(page).to have_selector(:link_or_button, 'Add another Code System Identifier Meaning')
      expect(page).to have_selector(:link_or_button, 'Add another Code System Identifier Value')
      expect(page).to have_selector(:link_or_button, 'Add another Valid Range')
    end
  end

  context 'when filling out the form' do
    before do
      fill_in 'Name', with: 'PNs_LIF'
      fill_in 'Standard Name', with: 'Standard_Name_1'
      fill_in 'Long Name', with: 'Volume mixing ratio of sum of peroxynitrates in air'
      fill_in 'Definition', with: 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)'

      within '.multiple.additional-identifiers' do
        within '.multiple-item-0' do
          fill_in 'Identifier', with: 'Additional_Identifier_Identifier_1'
        end

        click_on 'Add another Additional Identifier'

        within '.multiple-item-1' do
          fill_in 'Identifier', with: 'Additional_Identifier_Identifier_2'
          fill_in 'Description', with: 'Additional_Identifier_Description_2'
        end
      end

      select 'SCIENCE_VARIABLE', from: 'Variable Type'
      select 'SCIENCE_SCALAR', from: 'Variable Sub Type'
      fill_in 'Units', with: 'Npptv'
      select 'float', from: 'Data Type'
      fill_in 'Scale', with: 1.0
      fill_in 'Offset', with: 0.0

      within '.multiple.valid-ranges > .multiple-item-0' do
        fill_in 'Min', with: -417
        fill_in 'Max', with: 8836

        fill_in 'variable_draft_draft_valid_ranges_0_code_system_identifier_meaning_0', with: 'Code System Identifier Meaning 1'
        click_on 'Add another Code System Identifier Meaning'
        fill_in 'variable_draft_draft_valid_ranges_0_code_system_identifier_meaning_1', with: 'Code System Identifier Meaning 2'

        fill_in 'variable_draft_draft_valid_ranges_0_code_system_identifier_value_0', with: 'Code System Identifier Value 1'
        click_on 'Add another Code System Identifier Value'
        fill_in 'variable_draft_draft_valid_ranges_0_code_system_identifier_value_1', with: 'Code System Identifier Value 2'
        click_on 'Add another Code System Identifier Value'
        fill_in 'variable_draft_draft_valid_ranges_0_code_system_identifier_value_2', with: 'Code System Identifier Value 3'
      end

      click_on 'Add another Valid Range'

      within '.multiple.valid-ranges > .multiple-item-1' do
        fill_in 'Min', with: 0.0
        fill_in 'Max', with: 1.0

        fill_in 'variable_draft_draft_valid_ranges_1_code_system_identifier_meaning_0', with: 'Code System Identifier Meaning 1'
        click_on 'Add another Code System Identifier Meaning'
        fill_in 'variable_draft_draft_valid_ranges_1_code_system_identifier_meaning_1', with: 'Code System Identifier Meaning 2'
        click_on 'Add another Code System Identifier Meaning'
        fill_in 'variable_draft_draft_valid_ranges_1_code_system_identifier_meaning_2', with: 'Code System Identifier Meaning 3'

        fill_in 'variable_draft_draft_valid_ranges_1_code_system_identifier_value_0', with: 'Code System Identifier Value 1'
        click_on 'Add another Code System Identifier Value'
        fill_in 'variable_draft_draft_valid_ranges_1_code_system_identifier_value_1', with: 'Code System Identifier Value 2'
      end

      fill_in 'variable_draft_draft_index_ranges_lat_range_0', with: -90.0
      fill_in 'variable_draft_draft_index_ranges_lat_range_1', with: 90.0
      fill_in 'variable_draft_draft_index_ranges_lon_range_0', with: -180.0
      fill_in 'variable_draft_draft_index_ranges_lon_range_1', with: 180.0
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 7)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Variable Draft Updated Successfully!')

        expect(page).to have_field('variable_draft_draft_name', with: 'PNs_LIF')
        expect(page).to have_field('variable_draft_draft_standard_name', with: 'Standard_Name_1')
        expect(page).to have_field('variable_draft_draft_definition', with: 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)')
        expect(page).to have_field('variable_draft_draft_long_name', with: 'Volume mixing ratio of sum of peroxynitrates in air')
        expect(page).to have_field('variable_draft_draft_additional_identifiers_0_identifier', with: 'Additional_Identifier_Identifier_1')
        expect(page).to have_field('variable_draft_draft_additional_identifiers_1_identifier', with: 'Additional_Identifier_Identifier_2')
        expect(page).to have_field('variable_draft_draft_additional_identifiers_1_description', with: 'Additional_Identifier_Description_2')
        expect(page).to have_field('variable_draft_draft_variable_type', with: 'SCIENCE_VARIABLE')
        expect(page).to have_field('variable_draft_draft_variable_sub_type', with: 'SCIENCE_SCALAR')
        expect(page).to have_field('variable_draft_draft_units', with: 'Npptv')
        expect(page).to have_field('variable_draft_draft_data_type', with: 'float')
        expect(page).to have_field('variable_draft_draft_scale', with: '1.0')
        expect(page).to have_field('variable_draft_draft_offset', with: '0.0')
        expect(page).to have_field('variable_draft_draft_valid_ranges_0_min', with: '-417.0')
        expect(page).to have_field('variable_draft_draft_valid_ranges_0_max', with: '8836.0')
        expect(page).to have_field('variable_draft_draft_valid_ranges_0_code_system_identifier_meaning_0', with: 'Code System Identifier Meaning 1')
        expect(page).to have_field('variable_draft_draft_valid_ranges_0_code_system_identifier_meaning_1', with: 'Code System Identifier Meaning 2')
        expect(page).to have_field('variable_draft_draft_valid_ranges_0_code_system_identifier_value_0', with: 'Code System Identifier Value 1')
        expect(page).to have_field('variable_draft_draft_valid_ranges_0_code_system_identifier_value_1', with: 'Code System Identifier Value 2')
        expect(page).to have_field('variable_draft_draft_valid_ranges_0_code_system_identifier_value_2', with: 'Code System Identifier Value 3')
        expect(page).to have_field('variable_draft_draft_valid_ranges_1_min', with: '0.0')
        expect(page).to have_field('variable_draft_draft_valid_ranges_1_max', with: '1.0')
        expect(page).to have_field('variable_draft_draft_valid_ranges_1_code_system_identifier_meaning_0', with: 'Code System Identifier Meaning 1')
        expect(page).to have_field('variable_draft_draft_valid_ranges_1_code_system_identifier_meaning_1', with: 'Code System Identifier Meaning 2')
        expect(page).to have_field('variable_draft_draft_valid_ranges_1_code_system_identifier_meaning_2', with: 'Code System Identifier Meaning 3')
        expect(page).to have_field('variable_draft_draft_valid_ranges_1_code_system_identifier_value_0', with: 'Code System Identifier Value 1')
        expect(page).to have_field('variable_draft_draft_valid_ranges_1_code_system_identifier_value_1', with: 'Code System Identifier Value 2')
        expect(page).to have_field('variable_draft_draft_index_ranges_lat_range_0', with: '-90.0')
        expect(page).to have_field('variable_draft_draft_index_ranges_lat_range_1', with: '90.0')
        expect(page).to have_field('variable_draft_draft_index_ranges_lon_range_0', with: '-180.0')
        expect(page).to have_field('variable_draft_draft_index_ranges_lon_range_1', with: '180.0')
      end
    end
  end
end
