describe 'Valid Variable Draft Fill Value Preview' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Fill Value section' do
    it 'displays the form title as an edit link' do
      within '#fill_values-progress' do
        expect(page).to have_link('Fill Values', href: edit_variable_draft_path(@draft, 'fill_values'))
      end
    end

    it 'displays the correct status icon' do
      within '#fill_values-progress' do
        within '.status' do
          expect(page).to have_content('Fill Values is valid')
        end
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#fill_values-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#fill_values-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.fill-values')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.fill_values' do
        expect(page).to have_css('.umm-preview-field-container', count: 7)

        within '#variable_draft_draft_fill_values_preview' do
          expect(page).to have_css('h6', text: 'Fill Value 1')

          within '#variable_draft_draft_fill_values_0_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_value'))
            expect(page).to have_css('p', text: '-9999.0')
          end

          within '#variable_draft_draft_fill_values_0_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_type'))
            expect(page).to have_css('p', text: 'SCIENCE_FILLVALUE')
          end

          within '#variable_draft_draft_fill_values_0_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_description'))
            expect(page).to have_css('p', text: 'Pellentesque Bibendum Commodo Fringilla Nullam')
          end

          expect(page).to have_css('h6', text: 'Fill Value 2')

          within '#variable_draft_draft_fill_values_1_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_1_value'))
            expect(page).to have_css('p', text: '111.0')
          end

          within '#variable_draft_draft_fill_values_1_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_1_type'))
            expect(page).to have_css('p', text: 'ANCILLARY_FILLVALUE')
          end

          within '#variable_draft_draft_fill_values_1_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_1_description'))
            expect(page).to have_css('p', text: 'Pellentesque Nullam Ullamcorper Magna')
          end
        end
      end
    end
  end
end
