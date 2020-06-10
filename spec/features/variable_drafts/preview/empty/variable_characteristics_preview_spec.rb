describe 'Empty Variable Draft Variable Characteristics Preview' do
  before do
    login
    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Variable Characteristics section' do
    it 'displays the form title as an edit link' do
      within '#variable_characteristics-progress' do
        expect(page).to have_link('Variable Characteristics', href: edit_variable_draft_path(@draft, 'variable_characteristics'))
      end
    end

    it 'displays the correct status icon' do
      within '#variable_characteristics-progress' do
        within '.status' do
          expect(page).to have_content('Variable Characteristics is valid')
        end
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#variable_characteristics-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#variable_characteristics-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.characteristics')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.variable_characteristics' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_characteristics_preview' do
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics'))

          expect(page).to have_css('p', text: 'No value for Characteristics provided.')
        end
      end
    end
  end
end
