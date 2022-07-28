describe 'Tool Drafts Potential Action Form', js: true do
  before do
    login
  end

  context 'when viewing the form with no values' do
    before do
      draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_tool_draft_path(draft, 'potential_action')
    end

    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Potential Action')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content('Potential Action')
      end
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__body > div > div > label', text: 'Type')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Target')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Query Input')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end
  end

  context 'when visiting the edit page for a full tool draft' do
    let(:full_draft) { create(:full_tool_draft) }

    before do
      visit edit_tool_draft_path(full_draft, 'potential_action')
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__body > div > div > label', text: 'Type')
      expect(page).to have_select('Type', selected: 'SearchAction')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Target')
      expect(page).to have_select('Type', selected: 'EntryPoint')
      expect(page).to have_field('tool_draft_draft_potential_action_target_description', with: 'the description')
      expect(page).to have_field('tool_draft_draft_potential_action_target_response_content_type_0', with: 'text/html')
      expect(page).to have_field('Url Template', with: 'https://podaac-tools.jpl.nasa.gov/soto/#b=BlueMarble_ShadedRelief_Bathymetry&l={+layers}&ve={+bbox}&d={+date}')
      expect(page).to have_field('tool_draft_draft_potential_action_target_http_method_0', with: 'GET')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Query Input')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_0_value_name', with: 'layers')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_0_value_type', with: 'the query input value type')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_0_description', with: 'query input description for layers param')
      expect(page).to have_checked_field('tool_draft_draft_potential_action_query_input_0_value_required_true')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_1_value_name', with: 'date')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_1_value_type', with: 'the query input value type')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_1_description', with: 'query input description for date param')
      expect(page).to have_checked_field('tool_draft_draft_potential_action_query_input_1_value_required_false')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_2_value_name', with: 'bbox')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_2_value_type', with: 'the query input value type')
      expect(page).to have_field('tool_draft_draft_potential_action_query_input_2_description', with: 'query input description for bbox param')
      expect(page).to have_checked_field('tool_draft_draft_potential_action_query_input_2_value_required_false')
    end
  end

  context 'when filling out the form' do
    before do
      draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_tool_draft_path(draft, 'potential_action')

      select 'CreateAction', from: 'tool_draft_draft_potential_action_type'
      select 'EntryPoint', from: 'tool_draft_draft_potential_action_target_type'
      fill_in 'tool_draft_draft_potential_action_target_description', with: 'new_test_record target description'
      fill_in 'tool_draft_draft_potential_action_target_response_content_type_0', with: 'new_test_record target content_type_0'
      click_on 'Add another Response Content Type'
      fill_in 'tool_draft_draft_potential_action_target_response_content_type_1', with: 'new_test_record target content_type_1'
      fill_in 'tool_draft_draft_potential_action_target_url_template', with: 'http://example.com/{+a}{+b}'
      select 'GET', from: 'tool_draft_draft_potential_action_target_http_method_0'
      click_on 'Add another Http Method'
      select 'POST', from: 'tool_draft_draft_potential_action_target_http_method_1'
      fill_in 'tool_draft_draft_potential_action_query_input_0_value_type', with: 'new_test_record query_input value_type_0'
      fill_in 'tool_draft_draft_potential_action_query_input_0_description', with: 'new_test_record query_input description_0'
      fill_in 'tool_draft_draft_potential_action_query_input_0_value_name', with: 'new_test_record query_input value_name_0'
      choose('tool_draft_draft_potential_action_query_input_0_value_required_true', option: 'true')
      click_on 'Add another Query Input'
      fill_in 'tool_draft_draft_potential_action_query_input_1_value_type', with: 'new_test_record query_input value_type_1'
      fill_in 'tool_draft_draft_potential_action_query_input_1_description', with: 'new_test_record query_input description_1'
      fill_in 'tool_draft_draft_potential_action_query_input_1_value_name', with: 'new_test_record query_input value_name_1'
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_selector('label.eui-required-o', count: 7)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Tool Draft Updated Successfully!')
        expect(page).to have_css('.eui-accordion__body > div > div > label', text: 'Type')
        expect(page).to have_select('Type', selected: 'CreateAction')
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Target')
        expect(page).to have_select('Type', selected: 'EntryPoint')
        expect(page).to have_field('tool_draft_draft_potential_action_target_description', with: 'new_test_record target description')
        expect(page).to have_field('tool_draft_draft_potential_action_target_response_content_type_0', with: 'new_test_record target content_type_0')
        expect(page).to have_field('tool_draft_draft_potential_action_target_response_content_type_1', with: 'new_test_record target content_type_1')
        expect(page).to have_field('Url Template', with: 'http://example.com/{+a}{+b}')
        expect(page).to have_css('#tool_draft_draft_potential_action_target_http_method_0', text: 'GET')
        expect(page).to have_css('#tool_draft_draft_potential_action_target_http_method_1', text: 'POST')
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Query Input')
        expect(page).to have_field('tool_draft_draft_potential_action_query_input_0_value_name', with: 'new_test_record query_input value_name_0')
        expect(page).to have_field('tool_draft_draft_potential_action_query_input_0_value_type', with: 'new_test_record query_input value_type_0')
        expect(page).to have_field('tool_draft_draft_potential_action_query_input_0_description', with: 'new_test_record query_input description_0')
        expect(page).to have_checked_field('tool_draft_draft_potential_action_query_input_0_value_required_true')
        expect(page).to have_field('tool_draft_draft_potential_action_query_input_1_value_name', with: 'new_test_record query_input value_name_1')
        expect(page).to have_field('tool_draft_draft_potential_action_query_input_1_value_type', with: 'new_test_record query_input value_type_1')
        expect(page).to have_field('tool_draft_draft_potential_action_query_input_1_description', with: 'new_test_record query_input description_1')
      end
    end
  end

  context 'when filling out the form without required fields' do
    before do
      draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_tool_draft_path(draft, 'potential_action')
      fill_in 'tool_draft_draft_potential_action_target_description', with: 'new_test_record target description'
      fill_in 'tool_draft_draft_potential_action_target_url_template', with: 'http://example.com/{+a}{+b}{{c}'
    end
    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end
      it 'display error messages' do
        expect(page).to have_content('Type is required')
        expect(page).to have_content('Url Template is an incorrect format')
        expect(page).to have_content('Http Method is required')
      end
    end
  end
end
