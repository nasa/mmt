describe 'Valid Variable Draft Science Keywords Preview' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Science Keywords section' do
    it 'displays the form title as an edit link' do
      within '#science_keywords-progress' do
        expect(page).to have_link('Science Keywords', href: edit_variable_draft_path(@draft, 'science_keywords'))
      end
    end

    it 'displays the correct status icon' do
      within '#science_keywords-progress' do
        within '.status' do
          expect(page).to have_css('.eui-icon.icon-green.eui-check')
        end
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#science_keywords-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.science-keywords')
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'science_keywords', anchor: 'science-keywords'))
      end
    end

    it 'displays links to edit/update the data' do
      within '.umm-preview.science_keywords' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'science_keywords', anchor: 'variable_draft_draft_science_keywords'))
      end
    end

    include_examples 'Variable Science Keywords Full Preview'
  end
end
