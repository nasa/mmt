require 'rails_helper'

describe 'Valid Variable Service Preview', reset_provider: true do
  before do
    login
    ingest_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Service section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.service' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_service_preview' do
          expect(page).to have_css('h5', text: 'Services')

          expect(page).to have_css('h6', text: 'Service 1')

          within '#variable_draft_draft_service_0_service_type_preview' do
            expect(page).to have_css('h5', text: 'Service Type')
            expect(page).to have_css('ul li', text: 'ESI')
            expect(page).to have_css('ul li', text: 'WMS')
            expect(page).to have_css('ul li', text: 'WCS')
          end

          within '#variable_draft_draft_service_0_visualizable_preview' do
            expect(page).to have_css('h5', text: 'Visualizable')
            expect(page).to have_css('p', text: 'FALSE')
          end

          within '#variable_draft_draft_service_0_subsettable_preview' do
            expect(page).to have_css('h5', text: 'Subsettable')
            expect(page).to have_css('p', text: 'TRUE')
          end
        end
      end
    end
  end
end
