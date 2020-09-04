describe 'Invalid Variable Draft Variable Information Preview' do
  before do
    login
    @draft = create(:invalid_variable_draft, user: User.where(urs_uid: 'testuser').first)
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
          expect(page).to have_content('Variable Information is incomplete')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#variable_information-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required-o.icon-green.long-name')
        expect(page).to have_css('.eui-icon.eui-required-o.icon-green.definition')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#variable_information-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.standard-name')
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.additional-identifiers')
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.variable-type')
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.variable-sub-type')
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.units')
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.data-type')
      end
    end

    it 'displays the correct progress indicators for invalid fields' do
      within '#variable_information-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.name')
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.scale')
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.offset')
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.valid-ranges')
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.index-ranges')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within(first('section.umm-preview.variable_information')) do
        expect(page).to have_css('.umm-preview-field-container', count: 16)

        within '#variable_draft_draft_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_name'))

          expect(page).to have_css('p', text: '?')
        end

        within '#variable_draft_draft_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_long_name'))

          expect(page).to have_css('p', text: 'No value for Long Name provided.')
        end

        within '#variable_draft_draft_definition_preview' do
          expect(page).to have_css('h5', text: 'Definition')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_definition'))

          expect(page).to have_css('p', text: 'No value for Definition provided.')
        end

        within '#variable_draft_draft_standard_name_preview' do
          expect(page).to have_css('h5', text: 'Standard Name')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_standard_name'))

          expect(page).to have_css('p', text: 'No value for Standard Name provided.')
        end

        within '#variable_draft_draft_additional_identifiers_preview' do
          expect(page).to have_css('h5', text: 'Additional Identifiers')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_additional_identifiers'))

          expect(page).to have_css('p', text: 'No value for Additional Identifiers provided.')
        end

        within '#variable_draft_draft_variable_type_preview' do
          expect(page).to have_css('h5', text: 'Variable Type')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_variable_type'))

          expect(page).to have_css('p', text: 'No value for Variable Type provided.')
        end

        within '#variable_draft_draft_variable_sub_type_preview' do
          expect(page).to have_css('h5', text: 'Variable Sub Type')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_variable_sub_type'))

          expect(page).to have_css('p', text: 'No value for Variable Sub Type provided.')
        end

        within '#variable_draft_draft_units_preview' do
          expect(page).to have_css('h5', text: 'Units')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_units'))

          expect(page).to have_css('p', text: 'No value for Units provided.')
        end

        within '#variable_draft_draft_data_type_preview' do
          expect(page).to have_css('h5', text: 'Data Type')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_data_type'))

          expect(page).to have_css('p', text: 'No value for Data Type provided.')
        end

        within '#variable_draft_draft_scale_preview' do
          expect(page).to have_css('h5', text: 'Scale')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_scale'))

          expect(page).to have_css('p', text: 'string')
        end

        within '#variable_draft_draft_offset_preview' do
          expect(page).to have_css('h5', text: 'Offset')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_offset'))

          expect(page).to have_css('p', text: 'string')
        end

        within '#variable_draft_draft_valid_ranges_preview' do
          expect(page).to have_css('h5', text: 'Valid Ranges')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges'))

          expect(page).to have_css('h6', text: 'Valid Range 1')

          within '#variable_draft_draft_valid_ranges_0_min_preview' do
            expect(page).to have_css('h5', text: 'Min')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_min'))
            expect(page).to have_css('p', text: 'string')
          end

          within '#variable_draft_draft_valid_ranges_0_max_preview' do
            expect(page).to have_css('h5', text: 'Max')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_valid_ranges_0_max'))
            expect(page).to have_css('p', text: 'string')
          end
        end
      end
    end
  end
end
