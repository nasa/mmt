require 'rails_helper'

describe 'Valid Variable Dimensions Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Dimensions section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.dimensions' do
        expect(page).to have_css('.umm-preview-field-container', count: 5)

        within '#variable_dimensions_preview' do
          expect(page).to have_css('h6', text: 'Dimension 1')

          within '#variable_dimensions_0_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_css('p', text: 'Sampling time and depth')
          end

          within '#variable_dimensions_0_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_css('p', text: '3000')
          end

          expect(page).to have_css('h6', text: 'Dimension 2')

          within '#variable_dimensions_1_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_css('p', text: 'Lizard Herp Doc Pop')
          end

          within '#variable_dimensions_1_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_css('p', text: '2020')
          end
        end
      end
    end
  end
end
