# test for new permissions form and validation, implemented in MMT-507 and 152/153
# 509, 512

require 'rails_helper'

describe 'Collection Permissions form', js: true do
  context 'when visiting new collection permission page as a regular user' do
    before do
      login

      visit new_permission_path
    end

    it 'indicates this is a new collection permission page' do
      expect(page).to have_content('New Collection Permission')
    end

    it 'displays the new collection permission entry fields' do
      expect(page).to have_field('Name', type: 'text')
      expect(page).to have_field('Collections', type: 'select')
      expect(page).to have_field('Granules', type: 'select')
      expect(page).to have_field('Search', type: 'select', visible: false)
      expect(page).to have_field('Search and Order', type: 'select', visible: false)
    end

    it 'has the appropriate collections and granules options' do
      expect(page).to have_select('collection_options', with_options: ['All Collections', 'Selected Collections', 'No Access to Collections'])
      expect(page).to have_select('granule_options', with_options: ['All Granules', 'No Access to Granules'])
    end

    it 'does not display the collections or granules access constraint fields' do
      expect(page).to have_no_selector('fieldset#collection_constraint_values')
      expect(page).to have_no_selector('fieldset#granule_constraint_values')
    end

    context 'when selecting an option with access to collections' do
      before do
        select('All Collections', from: 'Collections')
      end

      it 'displays the collections access constraint fields' do
        within '#collection_constraint_values' do
          expect(page).to have_field('Minimum Access Constraint Value')
          expect(page).to have_field('Maximum Access Constraint Value')
          expect(page).to have_unchecked_field('Include Undefined')
        end
      end
    end

    context "when selecting the 'All Granules' option" do
      before do
        select('All Granules', from: 'Granules')
      end

      it 'displays the granules access constraint fields' do
        within '#granule_constraint_values' do
          expect(page).to have_field('Minimum Access Constraint Value')
          expect(page).to have_field('Maximum Access Constraint Value')
          expect(page).to have_unchecked_field('Include Undefined')
        end
      end
    end

    context 'when selecting a group for Search Groups' do
      before do
        # Using the standard Capybara 'select _, from _' method does not trigger the
        # correct select2 event needed for our form event handlers, so we need
        # to find more specific elements of select2 to choose our selection and
        # trigger the appropriate event.
        within '#search_groups_cell' do
          page.find('ul.select2-selection__rendered').click
          page.find('.select2-search__field').native.send_keys('gue')
        end

        page.find('ul#select2-search_groups_-results li.select2-results__option--highlighted').click
      end

      it 'selects the group in the Search Groups input' do
        within '#search_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: 'All Guest Users')
        end
      end

      it 'disables the selected option in the Search & Order Groups input' do
        within '#search_and_order_groups_cell' do
          expect(page).to have_css('option[disabled]', text: 'All Guest Users')
        end
      end

      context 'when unselecting the group' do
        before do
          within '#search_groups_cell' do
            page.find('.select2-selection__choice[title="All Guest Users"] > .select2-selection__choice__remove').click
          end
        end

        it 'unselects the group from the Search Groups input' do
          expect(page).to have_no_css('li.select2-selection__choice', text: 'All Guest Users')
        end

        it 'enables the unselected option in the other select input' do
          within '#search_and_order_groups_cell' do
            expect(page).to have_no_css('option[disabled]', text: 'All Guest Users')
            expect(page).to have_css('option', text: 'All Guest Users')
          end
        end
      end
    end

    context 'when attempting to create a collection permission with invalid information' do
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

    context 'when attempting to create a collection permission with empty collection selection' do
      before do
        select 'Selected Collections', from: 'Collections'
        click_on 'Submit'
      end

      it 'displays the appropriate validation errors' do
        expect(page).to have_content('Permission Name is required.')
        expect(page).to have_content('You must select at least 1 collection.')
        expect(page).to have_content('Granules must be specified.')
        expect(page).to have_content('Please specify at least one Search group or one Search & Order group.')
      end
    end

    context 'when attempting to submit a collection permission with conditionally required fields partially filled in' do
      before do
        select('All Collections', from: 'Collections')
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

    context 'when attempting to submit a collection permission with incorrect Min and Max values' do
      before do
        select('All Collections', from: 'Collections')
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

      it 'displays the appropriate validation errors for the Min and Max fields' do
        within '#collection_constraint_values' do
          expect(page).to have_content('Maximum value must be greater than Minimum value.')
        end
        within '#granule_constraint_values' do
          expect(page).to have_content('Maximum value must be greater than Minimum value.')
        end
      end
    end
  end

  context 'when visiting new collection permission page as an admin' do
    before do
      login_admin

      visit new_permission_path
    end

    it 'indicates this is a new collection permission page' do
      expect(page).to have_content('New Collection Permission')
    end

    it 'displays system groups as options in the Groups Permissions table select' do
      within '#search_groups_cell' do
        expect(page).to have_select('search_groups_', with_options: ['Administrators', 'Administrators_2'])
      end

      within '#search_and_order_groups_cell' do
        expect(page).to have_select('search_and_order_groups_', with_options: ['Administrators', 'Administrators_2'])
      end
    end
  end
end
