require 'rails_helper'

describe 'Valid Service Service Keywords Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  context 'When examing the Service Keywords section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.service_keywords' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#service_service_keywords_preview' do
          expect(page).to have_css('h5', text: 'Service Keywords')

          keyword_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
          expect(keyword_parts[0]).to have_content('EARTH SCIENCE SERVICES')
          expect(keyword_parts[1]).to have_content('DATA ANALYSIS AND VISUALIZATION')
          expect(keyword_parts[2]).to have_content('GEOGRAPHIC INFORMATION SYSTEMS')
          expect(keyword_parts[3]).to have_content('DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
        end
      end
    end
  end
end
