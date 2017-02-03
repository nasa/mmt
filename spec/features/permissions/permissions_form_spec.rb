# test for new permissions form and validation, implemented in MMT-507 and 152/153

require 'rails_helper'

describe 'Collection Permissions form', js: true do
  context 'when visiting new permission page' do
    before do
      login

      visit new_permission_path
    end

    it 'indicates this is a new permission page' do
      expect(page).to have_content('New Permission')
    end

    it 'displays the new permission entry fields' do
      expect(page).to have_field('Name', type: 'text')
      expect(page).to have_field('Collections', type: 'select')
      expect(page).to have_field('Granules', type: 'select')
      expect(page).to have_field('Search', type: 'select', visible: false)
      expect(page).to have_field('Search and Order', type: 'select', visible: false)

      within '#collection_constraint_values' do
        expect(page).to have_field('Minimum Access Constraint Value', type: 'number')
        expect(page).to have_field('Maximum Access Constraint Value', type: 'number')
        expect(page).to have_unchecked_field('Include Undefined')
      end
    end

    it 'does not display the granule constraint fields' do
      expect(page).to have_no_selector('fieldset#granule_constraint_values')
    end

    context "when selecting the 'All Granules' option" do
      before do
        select('All Granules', from: 'Granules')
      end

      it 'displays the granule constraint fields' do
        within '#granule_constraint_values' do
          expect(page).to have_field('Minimum Access Constraint Value', type: 'number')
          expect(page).to have_field('Maximum Access Constraint Value', type: 'number')
          expect(page).to have_unchecked_field('Include Undefined')
        end
      end
    end


    context 'when attempting to create a permission with invalid information' do
      before do
        click_on 'Submit'
      end

      it 'displays validation errors on the form' do
        expect(page).to have_content('Permission Name is required.')
        expect(page).to have_content('Collections must be specified.')
        expect(page).to have_content('Granules must be specified.')
        expect(page).to have_content('Please specify at least one Search group or one Search & Order group.')
      end
    end

    context 'when attempting to create a permission with empty collection selection' do
      before do
        select 'Selected Collections', from: 'Collections'
        click_on 'Submit'
      end

      it 'displays the appropriate validation errors' do
        expect(page).to have_content('Permission Name is required.')
        expect(page).to have_content('Please specify collections.')
        expect(page).to have_content('Granules must be specified.')
        expect(page).to have_content('Please specify at least one Search group or one Search & Order group.')
      end
    end

    context 'when attempting to submit a permission with conditionally required fields partially filled in' do
      before do
        within '#collection_constraint_values' do
          fill_in('Maximum Access Constraint Value', with: 5)
        end

        select('All Granules', from: 'Granules')
        within '#granule_constraint_values' do
          fill_in('Minimum Access Constraint Value', with: 0)
        end

        click_on 'Submit'
      end

      it 'displays validation errors for the conditionally required fields' do
        within '#collection_constraint_values' do
          expect(page).to have_content('Minimum and Maximum values must be specified together.')
        end
        within '#granule_constraint_values' do
          expect(page).to have_content('Minimum and Maximum values must be specified together.')
        end
      end
    end

    context 'when attempting to submit a permission with incorrect Min and Max values' do
      before do
        within '#collection_constraint_values' do
          fill_in('Minimum Access Constraint Value', with: 20)
          fill_in('Maximum Access Constraint Value', with: 5)
        end

        select('All Granules', from: 'Granules')
        within '#granule_constraint_values' do
          fill_in('Minimum Access Constraint Value', with: 9)
          fill_in('Maximum Access Constraint Value', with: 1)
        end

        click_on 'Submit'
      end

      it 'displays the appropriate validation errors for the Min and Max fields'
      # TODO: need to get this working properly first
    end
  end
end
