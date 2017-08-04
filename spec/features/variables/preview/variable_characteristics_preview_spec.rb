require 'rails_helper'

describe 'Valid Variable Variable Characteristics Preview', reset_provider: true do
  before do
    login
    ingest_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Variable Characteristics section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.variable_characteristics' do
        expect(page).to have_css('.umm-preview-field-container', count: 11)

        within '#variable_draft_draft_characteristics_standard_name_preview' do
          expect(page).to have_css('h5', text: 'Standard Name')

          expect(page).to have_css('p', text: 'peroxynitrates')
        end

        within '#variable_draft_draft_characteristics_reference_preview' do
          expect(page).to have_css('h5', text: 'Reference')

          expect(page).to have_css('p', text: 'Reference')
        end

        within '#variable_draft_draft_characteristics_coordinates_preview' do
          expect(page).to have_css('h5', text: 'Coordinates')

          expect(page).to have_css('p', text: 'Sampling location given in aircraft navigation data set: DISCOVERAQ-REVEAL-TEXAS')
        end

        within '#variable_draft_draft_characteristics_grid_mapping_preview' do
          expect(page).to have_css('h5', text: 'Grid Mapping')

          expect(page).to have_css('p', text: 'N/A')
        end

        within '#variable_draft_draft_characteristics_size_preview' do
          expect(page).to have_css('h5', text: 'Size')

          expect(page).to have_css('p', text: '23')
        end

        within '#variable_draft_draft_characteristics_size_units_preview' do
          expect(page).to have_css('h5', text: 'Size Units')

          expect(page).to have_css('p', text: 'MB')
        end

        within '#variable_draft_draft_characteristics_bounds_preview' do
          expect(page).to have_css('h5', text: 'Bounds')

          expect(page).to have_css('p', text: 'Lon: -94.5, -75.5 E; Lat: 29.1, 38.0 N')
        end

        within '#variable_draft_draft_characteristics_chunk_size_preview' do
          expect(page).to have_css('h5', text: 'Chunk Size')

          expect(page).to have_css('p', text: '42')
        end

        within '#variable_draft_draft_characteristics_structure_preview' do
          expect(page).to have_css('h5', text: 'Structure')

          expect(page).to have_css('p', text: 'float: seconds, NO2_LIF, PNs_LIF, ANs_LIF, HNO3_LIF, NO2_LIF_noise, PNs_LIF_noise, ANs_LIF_noise, HNO3_LIF_noise: 10 granules: different number of lines for each granule')
        end

        within '#variable_draft_draft_characteristics_measurement_conditions_preview' do
          expect(page).to have_css('h5', text: 'Measurement Conditions')

          expect(page).to have_css('p', text: 'Measurement Conditions')
        end

        within '#variable_draft_draft_characteristics_reporting_conditions_preview' do
          expect(page).to have_css('h5', text: 'Reporting Conditions')

          expect(page).to have_css('p', text: 'Reporting Conditions')
        end
      end
    end
  end
end
