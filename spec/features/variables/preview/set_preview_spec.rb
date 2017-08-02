require 'rails_helper'

describe 'Valid Variable Set Preview', reset_provider: true do
  before do
    login
    ingest_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Set section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.set' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_set_preview' do
          expect(page).to have_css('h5', text: 'Sets')

          expect(page).to have_css('h6', text: 'Set 1')

          within '#variable_draft_draft_set_0_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_css('p', text: 'DISCOVERAQ')
          end

          within '#variable_draft_draft_set_0_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_css('p', text: 'REVEAL-TEXAS')
          end

          within '#variable_draft_draft_set_0_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_css('p', text: '10')
          end

          within '#variable_draft_draft_set_0_index_preview' do
            expect(page).to have_css('h5', text: 'Index')
            expect(page).to have_css('p', text: '2')
          end
        end
      end
    end
  end
end
