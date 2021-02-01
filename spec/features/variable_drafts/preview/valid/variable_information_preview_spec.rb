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
          expect(page).to have_css('.eui-icon.icon-green.eui-check')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#variable_information-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required.icon-green.name-label')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.definition-label')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.long-name-label')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#variable_information-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.standard-name-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.additional-identifiers-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.variable-type-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.variable-sub-type-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.units-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.data-type-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.scale-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.offset-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.valid-ranges-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.index-ranges-label')
      end
    end

    it 'displays links to edit/update the data' do
      within(first('.umm-preview.variable_information')) do
        expect(page).to have_css('.umm-preview-field-container', count: 24)

        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_name'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_long_name'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_definition'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_standard_name'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_additional_identifiers'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_additional_identifiers_0_identifier'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_additional_identifiers_0_description'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_additional_identifiers_1_identifier'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_additional_identifiers_1_description'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_variable_type'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_variable_sub_type'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_units'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_data_type'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_scale'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_offset'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_min'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_max'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_code_system_identifier_meaning'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_code_system_identifier_value'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_1_min'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_1_max'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_1_code_system_identifier_meaning'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_1_code_system_identifier_value'))
      end
    end

    include_examples 'Variable Information Full Preview'
  end
end
