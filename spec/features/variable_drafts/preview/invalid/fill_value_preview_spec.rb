describe 'Invalid Variable Draft Fill Value Preview' do
  before do
    login
    @draft = create(:invalid_variable_draft, user: User.where(urs_uid: 'testuser').first)
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
          expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
        end
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#fill_values-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required-o.icon-green')
      end
    end

    it 'displays no progress indicators for non required fields' do
      within '#fill_values-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-fa-circle.icon-grey')
      end
    end

    it 'displays the correct progress indicators for invalid fields' do
      within '#fill_values-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.fill-values')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.fill_values' do
        expect(page).to have_css('.umm-preview-field-container', count: 4)

        expect(page).to have_css('h6', text: 'Fill Value 1')

        within '#variable_draft_draft_fill_values_preview' do
          within '#variable_draft_draft_fill_values_0_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_value'))
            expect(page).to have_css('p', text: 'string')
          end

          within '#variable_draft_draft_fill_values_0_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_type'))
            expect(page).to have_css('p', text: 'No value for Type provided.')
          end

          within '#variable_draft_draft_fill_values_0_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_description'))
            expect(page).to have_css('p', text: 'No value for Description provided.')
          end
        end
      end
    end
  end
end
