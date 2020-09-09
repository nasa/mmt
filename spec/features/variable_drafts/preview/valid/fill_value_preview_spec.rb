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
          expect(page).to have_css('.eui-icon.icon-green.eui-check')
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

    it 'displays links to edit/update the data' do
      within '.umm-preview.fill_values' do
        expect(page).to have_css('.umm-preview-field-container', count: 7)

        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_value'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_type'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_0_description'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_1_value'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_1_type'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'fill_values', anchor: 'variable_draft_draft_fill_values_1_description'))
      end
    end

    include_examples 'Variable Fill Value Full Preview'
  end
end
