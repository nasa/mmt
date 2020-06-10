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
          expect(page).to have_content('Science Keywords is valid')
        end
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#science_keywords-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.science-keywords')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.science_keywords' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_science_keywords_preview' do
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'science_keywords', anchor: 'variable_draft_draft_science_keywords'))

          keyword_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
          expect(keyword_parts[0]).to have_content('EARTH SCIENCE')
          expect(keyword_parts[1]).to have_content('SOLID EARTH')
          expect(keyword_parts[2]).to have_content('ROCKS/MINERALS/CRYSTALS')

          keyword_parts = page.all('ul.arrow-tag-group-list').last.all('li.arrow-tag-group-item')
          expect(keyword_parts[0]).to have_content('EARTH SCIENCE')
          expect(keyword_parts[1]).to have_content('ATMOSPHERE')
          expect(keyword_parts[2]).to have_content('ATMOSPHERIC TEMPERATURE')
        end
      end
    end
  end
end
