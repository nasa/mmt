require 'rails_helper'

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

    it 'displays the corrent status icon' do
      within '#science_keywords-progress' do
        within '.status' do
          expect(page).to have_content('Science Keywords is valid')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#science_keywords-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required.icon-green.variable_draft_draft_science_keywords')
      end
    end

    it 'displays no progress indicators for non required fields' do
      within '#science_keywords-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-fa-circle.icon-grey')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.science_keywords' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_science_keywords_preview' do
          expect(page).to have_css('h5', text: 'Science Keywords')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'science_keywords', anchor: 'variable_draft_draft_science_keywords'))

          keyword_parts = page.all('ul.arrow-tag-group-list li.arrow-tag-group-item')

          expect(keyword_parts[0]).to have_content('EARTH SCIENCE')
          expect(keyword_parts[1]).to have_content('ATMOSPHERE')
          expect(keyword_parts[2]).to have_content('ATMOSPHERIC CHEMISTRY')
          expect(keyword_parts[3]).to have_content('NITROGEN COMPOUNDS')
          expect(keyword_parts[4]).to have_content('Peroxyacyl Nitrate')
        end
      end
    end
  end
end
