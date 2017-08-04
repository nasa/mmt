require 'rails_helper'

describe 'Valid Variable Fill Value Preview', reset_provider: true do
  before do
    login
    ingest_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Fill Value section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.fill_value' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_fill_value_preview' do
          expect(page).to have_css('h5', text: 'Fill Values')

          expect(page).to have_css('h6', text: 'Fill Value 1')

          within '#variable_draft_draft_fill_value_0_value_preview' do
            expect(page).to have_css('h5', text: 'Value')
            expect(page).to have_css('p', text: '-9999.0')
          end

          within '#variable_draft_draft_fill_value_0_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_css('p', text: 'Science')
          end

          within '#variable_draft_draft_fill_value_0_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_css('p', text: 'Fill Value Description')
          end
        end
      end
    end
  end
end
