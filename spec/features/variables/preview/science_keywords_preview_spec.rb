require 'rails_helper'

describe 'Valid Variable Science Keywords Preview', reset_provider: true do
  before do
    login
    ingest_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Science Keywords section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.science_keywords' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_science_keywords_preview' do
          expect(page).to have_css('h5', text: 'Science Keywords')

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
