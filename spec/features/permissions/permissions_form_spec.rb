# test for new permissions form and validation, implemented in MMT-507 and 152/153

require 'rails_helper'

describe 'Permissions form', js: true do
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
    end

    context 'when attempting to create a permission with invalid information' do
      before do
        click_on 'Save'
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
        click_on 'Save'
      end

      it 'displays the appropriate validation errors' do
        expect(page).to have_content('Permission Name is required.')
        expect(page).to have_content('Please specify collections.')
        expect(page).to have_content('Granules must be specified.')
        expect(page).to have_content('Please specify at least one Search group or one Search & Order group.')
      end
    end
  end
end