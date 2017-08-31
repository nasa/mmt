
require 'rails_helper'

describe 'Characteristics Form', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'variable_characteristics')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Variable Characteristics')
      expect(page).to have_content('The elements of this section apply to a variable.')
    end

    it 'has no required fields' do
      expect(page).not_to have_selector('label.eui-required-o')
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Dimensions')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Variable Characteristics')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end
      end
    end

    context 'When selecting the previous form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Dimensions', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Dimensions')
        end

        within '.umm-form' do
          expect(page).to have_content('Dimensions')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Science Keywords', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Science Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    before do
      draft_charcteristics = {
        'StandardName': 'Tortor Ultricies Nibh Adipiscing',
        'Reference': 'https://developer.earthdata.nasa.gov/',
        'Coordinates': '38.8059922,-77.0435327',
        'GridMapping': 'Mercator',
        'Size': '10',
        'SizeUnits': 'nm',
        'Bounds': 'UpperLeftPointMtrs = -180.0, 89.5; LowerRightMtrs = 177.5, -89.5',
        'ChunkSize': '100',
        'Structure': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'MeasurementConditions': 'Nulla vitae elit libero, a pharetra augue.',
        'ReportingConditions': 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.'
      }
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'Characteristics': draft_charcteristics })
      visit edit_variable_draft_path(draft, 'variable_characteristics')
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_characteristics_standard_name', with: 'Tortor Ultricies Nibh Adipiscing')
      expect(page).to have_field('variable_draft_draft_characteristics_reference', with: 'https://developer.earthdata.nasa.gov/')
      expect(page).to have_field('variable_draft_draft_characteristics_coordinates', with: '38.8059922,-77.0435327')
      expect(page).to have_field('variable_draft_draft_characteristics_grid_mapping', with: 'Mercator')
      expect(page).to have_field('variable_draft_draft_characteristics_size', with: '10')
      expect(page).to have_field('variable_draft_draft_characteristics_size_units', with: 'nm')
      expect(page).to have_field('variable_draft_draft_characteristics_bounds', with: 'UpperLeftPointMtrs = -180.0, 89.5; LowerRightMtrs = 177.5, -89.5')
      expect(page).to have_field('variable_draft_draft_characteristics_chunk_size', with: '100')
      expect(page).to have_field('variable_draft_draft_characteristics_structure', with: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
      expect(page).to have_field('variable_draft_draft_characteristics_measurement_conditions', with: 'Nulla vitae elit libero, a pharetra augue.')
      expect(page).to have_field('variable_draft_draft_characteristics_reporting_conditions', with: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.')
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Dimensions')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Variable Characteristics')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end
      end

      it 'displays the correct values in the form' do
        expect(page).to have_field('variable_draft_draft_characteristics_standard_name', with: 'Tortor Ultricies Nibh Adipiscing')
        expect(page).to have_field('variable_draft_draft_characteristics_reference', with: 'https://developer.earthdata.nasa.gov/')
        expect(page).to have_field('variable_draft_draft_characteristics_coordinates', with: '38.8059922,-77.0435327')
        expect(page).to have_field('variable_draft_draft_characteristics_grid_mapping', with: 'Mercator')
        expect(page).to have_field('variable_draft_draft_characteristics_size', with: '10.0')
        expect(page).to have_field('variable_draft_draft_characteristics_size_units', with: 'nm')
        expect(page).to have_field('variable_draft_draft_characteristics_bounds', with: 'UpperLeftPointMtrs = -180.0, 89.5; LowerRightMtrs = 177.5, -89.5')
        expect(page).to have_field('variable_draft_draft_characteristics_chunk_size', with: '100.0')
        expect(page).to have_field('variable_draft_draft_characteristics_structure', with: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        expect(page).to have_field('variable_draft_draft_characteristics_measurement_conditions', with: 'Nulla vitae elit libero, a pharetra augue.')
        expect(page).to have_field('variable_draft_draft_characteristics_reporting_conditions', with: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.')
      end
    end
  end
end
