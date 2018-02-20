require 'rails_helper'

describe 'Valid Variable Draft Variable Characteristics Preview' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Variable Characteristics section' do
    it 'displays the form title as an edit link' do
      within '#variable_characteristics-progress' do
        expect(page).to have_link('Variable Characteristics', href: edit_variable_draft_path(@draft, 'variable_characteristics'))
      end
    end

    it 'displays the corrent status icon' do
      within '#variable_characteristics-progress' do
        within '.status' do
          expect(page).to have_content('Variable Characteristics is valid')
        end
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#variable_characteristics-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#variable_characteristics-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.characteristics')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.variable_characteristics' do
        expect(page).to have_css('.umm-preview-field-container', count: 11)

        within '#variable_draft_draft_characteristics_standard_name_preview' do
          expect(page).to have_css('h5', text: 'Standard Name')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_standard_name'))

          expect(page).to have_css('p', text: 'Tortor Ultricies Nibh Adipiscing')
        end

        within '#variable_draft_draft_characteristics_reference_preview' do
          expect(page).to have_css('h5', text: 'Reference')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_reference'))

          expect(page).to have_css('p', text: 'https://developer.earthdata.nasa.gov/')
        end

        within '#variable_draft_draft_characteristics_coordinates_preview' do
          expect(page).to have_css('h5', text: 'Coordinates')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_coordinates'))

          expect(page).to have_css('p', text: '38.8059922,-77.0435327')
        end

        within '#variable_draft_draft_characteristics_grid_mapping_preview' do
          expect(page).to have_css('h5', text: 'Grid Mapping')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_grid_mapping'))

          expect(page).to have_css('p', text: 'Mercator')
        end

        within '#variable_draft_draft_characteristics_size_preview' do
          expect(page).to have_css('h5', text: 'Size')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_size'))

          expect(page).to have_css('p', text: 10.0)
        end

        within '#variable_draft_draft_characteristics_size_units_preview' do
          expect(page).to have_css('h5', text: 'Size Units')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_size_units'))

          expect(page).to have_css('p', text: 'nm')
        end

        within '#variable_draft_draft_characteristics_bounds_preview' do
          expect(page).to have_css('h5', text: 'Bounds')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_bounds'))

          expect(page).to have_css('p', text: 'UpperLeftPointMtrs = -180.0, 89.5; LowerRightMtrs = 177.5, -89.5')
        end

        within '#variable_draft_draft_characteristics_chunk_size_preview' do
          expect(page).to have_css('h5', text: 'Chunk Size')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_chunk_size'))

          expect(page).to have_css('p', text: '100.0')
        end

        within '#variable_draft_draft_characteristics_structure_preview' do
          expect(page).to have_css('h5', text: 'Structure')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_structure'))

          expect(page).to have_css('p', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        end

        within '#variable_draft_draft_characteristics_measurement_conditions_preview' do
          expect(page).to have_css('h5', text: 'Measurement Conditions')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_measurement_conditions'))

          expect(page).to have_css('p', text: 'Nulla vitae elit libero, a pharetra augue.')
        end

        within '#variable_draft_draft_characteristics_reporting_conditions_preview' do
          expect(page).to have_css('h5', text: 'Reporting Conditions')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_reporting_conditions'))

          expect(page).to have_css('p', text: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.')
        end
      end
    end
  end
end
