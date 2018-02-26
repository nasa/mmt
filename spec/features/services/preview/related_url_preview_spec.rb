require 'rails_helper'

describe 'Valid Service Related URL Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  context 'When examing the Related URL section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.related_url' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#service_related_url_preview' do
          expect(page).to have_css('h5', text: 'Related Url')

          within '.card-header' do
            expect(page).to have_content('DistributionURL')
          end
          within '.card-body' do
            expect(page).to have_content('Test related url')

            type_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
            expect(type_parts[0]).to have_content('GET SERVICE')
            expect(type_parts[1]).to have_content('SOFTWARE PACKAGE')
          end
        end
      end
    end
  end
end
