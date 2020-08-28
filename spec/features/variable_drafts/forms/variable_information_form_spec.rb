describe 'Variable Information Form', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft)
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

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
      end
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Sets')
        end

        within '.umm-form' do
          expect(page).to have_content('Sets')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Fill Value')
        end

        within '.umm-form' do
          expect(page).to have_content('Fill Value')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end

        click_on 'Yes'
      end

      it 'saves the draft and reloads the form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Variable Information')
        end

        within '.umm-form' do
          expect(page).to have_content('Variable Information')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Fill Values', from: 'Save & Jump To:'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Fill Values')
        end

        within '.umm-form' do
          expect(page).to have_content('Fill Values')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    let(:draft) {
      create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first, draft_short_name: 'PNs_LIF', draft_entry_title: 'Volume mixing ratio of sum of peroxynitrates in air')
    }

    before do
      visit edit_variable_draft_path(draft, 'variable_information')
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_name', with: 'PNs_LIF')
      expect(page).to have_field('variable_draft_draft_definition', with: 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)')
      expect(page).to have_field('variable_draft_draft_long_name', with: 'Volume mixing ratio of sum of peroxynitrates in air')
      expect(page).to have_field('variable_draft_draft_variable_type', with: 'SCIENCE_VARIABLE')
      expect(page).to have_field('variable_draft_draft_variable_sub_type', with: 'SCIENCE_SCALAR')
      expect(page).to have_field('variable_draft_draft_units', with: 'Npptv')
      expect(page).to have_field('variable_draft_draft_data_type', with: 'float')
      expect(page).to have_field('variable_draft_draft_valid_ranges_0_min', with: '-417')
      expect(page).to have_field('variable_draft_draft_valid_ranges_0_max', with: '8836')
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
      expect(page).to have_field('variable_draft_draft_scale', with: '1.0')
      expect(page).to have_field('variable_draft_draft_offset', with: '0.0')
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Sets')
        end

        within '.umm-form' do
          expect(page).to have_content('Sets')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Fill Value')
        end

        within '.umm-form' do
          expect(page).to have_content('Fill Value')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft without making any changes' do
        expect(draft.draft).to eq(Draft.last.draft)
      end

      it 'saves the draft and reloads the form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Variable Information')
        end

        within '.umm-form' do
          expect(page).to have_content('Variable Information')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
        end
      end

      it 'displays the correct values in the form' do
        expect(page).to have_field('variable_draft_draft_name', with: 'PNs_LIF')
        expect(page).to have_field('variable_draft_draft_definition', with: 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)')
        expect(page).to have_field('variable_draft_draft_long_name', with: 'Volume mixing ratio of sum of peroxynitrates in air')
        expect(page).to have_field('variable_draft_draft_variable_type', with: 'SCIENCE_VARIABLE')
        expect(page).to have_field('variable_draft_draft_variable_sub_type', with: 'SCIENCE_SCALAR')
        expect(page).to have_field('variable_draft_draft_units', with: 'Npptv')
        expect(page).to have_field('variable_draft_draft_data_type', with: 'float')
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
        expect(page).to have_field('variable_draft_draft_scale', with: '1.0')
        expect(page).to have_field('variable_draft_draft_offset', with: '0.0')
      end
    end
  end
end
