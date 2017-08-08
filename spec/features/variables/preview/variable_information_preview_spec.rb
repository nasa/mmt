require 'rails_helper'

describe 'Valid Variable Variable Information Preview', reset_provider: true do
  before do
    login
    ingest_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Variable Information section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.variable_information' do
        expect(page).to have_css('.umm-preview-field-container', count: 9)

        within '#variable_draft_draft_name_preview' do
          expect(page).to have_css('h5', text: 'Name')

          expect(page).to have_css('p', text: 'PNs_LIF')
        end

        within '#variable_draft_draft_definition_preview' do
          expect(page).to have_css('h5', text: 'Definition')

          expect(page).to have_css('p', text: 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)')
        end

        within '#variable_draft_draft_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')

          expect(page).to have_css('p', text: 'Volume mixing ratio of sum of peroxynitrates in air')
        end

        within '#variable_draft_draft_variable_type_preview' do
          expect(page).to have_css('h5', text: 'Variable Type')

          expect(page).to have_css('p', text: 'SCIENCE_VARIABLE')
        end

        within '#variable_draft_draft_units_preview' do
          expect(page).to have_css('h5', text: 'Units')

          expect(page).to have_css('p', text: 'Npptv')
        end

        within '#variable_draft_draft_data_type_preview' do
          expect(page).to have_css('h5', text: 'Data Type')

          expect(page).to have_css('p', text: 'float')
        end

        within '#variable_draft_draft_scale_preview' do
          expect(page).to have_css('h5', text: 'Scale')

          expect(page).to have_css('p', text: '1.0')
        end

        within '#variable_draft_draft_offset_preview' do
          expect(page).to have_css('h5', text: 'Offset')

          expect(page).to have_css('p', text: '0.0')
        end

        within '#variable_draft_draft_valid_range_preview' do
          expect(page).to have_css('h5', text: 'Valid Range')

          expect(page).to have_css('h6', text: 'Valid Range 1')

          within '#variable_draft_draft_valid_range_0_min_preview' do
            expect(page).to have_css('h5', text: 'Min')
            expect(page).to have_css('p', text: '-417')
          end

          within '#variable_draft_draft_valid_range_0_max_preview' do
            expect(page).to have_css('h5', text: 'Max')
            expect(page).to have_css('p', text: '8836')
          end
        end
      end
    end
  end
end
