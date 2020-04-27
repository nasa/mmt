# test for new permissions form and validation, implemented in MMT-507 and 152/153
# 509, 512

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

      expect(page).to have_field('collection_applicable')
      expect(page).to have_field('granule_applicable')

      expect(page).to have_field('collection_option_all')
      expect(page).to have_field('collection_option_selected')

      expect(page).to have_field('collection_access_value[min_value]')
      expect(page).to have_field('collection_access_value[max_value]')
      expect(page).to have_field('collection_access_value[include_undefined_value]')

      expect(page).to have_field('granule_access_value[min_value]', disabled: true)
      expect(page).to have_field('granule_access_value[max_value]', disabled: true)
      expect(page).to have_field('granule_access_value[include_undefined_value]', disabled: true)

      expect(page).to have_field('collection_temporal_filter[start_date]')
      expect(page).to have_field('collection_temporal_filter[stop_date]')
      expect(page).to have_field('collection_temporal_filter[mask]')

      expect(page).to have_field('granule_temporal_filter[start_date]', disabled: true)
      expect(page).to have_field('granule_temporal_filter[stop_date]', disabled: true)
      expect(page).to have_field('granule_temporal_filter[mask]', disabled: true)

      expect(page).to have_field('Search', type: 'select', visible: false)
      expect(page).to have_field('Search and Order', type: 'select', visible: false)
    end

    context 'when acl applies to granules' do
      before do
        check('Granules')
      end

      it 'displays the collections access constraint fields' do
        within '#granule-access-constraints-container' do
          expect(page).to have_field('granule_access_value[min_value]', disabled: false)
          expect(page).to have_field('granule_access_value[max_value]', disabled: false)
          expect(page).to have_field('granule_access_value[include_undefined_value]', disabled: false)
        end

        within '#granule-temporal-filter-container' do
          expect(page).to have_field('granule_temporal_filter[start_date]', disabled: false)
          expect(page).to have_field('granule_temporal_filter[stop_date]', disabled: false)
          expect(page).to have_field('granule_temporal_filter[mask]', disabled: false)
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
        expect(page).to have_content('Permission must apply to Collections and/or Granules.')
        expect(page).to have_content('Please specify at least one Search group or one Search & Order group.')
      end
    end

    context 'when attempting to create a collection permission with empty collection selection' do
      before do
        choose 'Selected Collections'

        click_on 'Submit'
      end

      it 'displays the appropriate validation errors' do
        expect(page).to have_content('Permission Name is required.')
        expect(page).to have_content('Permission must apply to Collections and/or Granules.')
        expect(page).to have_content('You must select at least 1 collection.')
        expect(page).to have_content('Please specify at least one Search group or one Search & Order group.')
      end
    end

    context 'when attempting to submit a collection permission with conditionally required fields partially filled in' do
      before do
        within '#collection-access-constraints-container' do
          fill_in('Maximum Value', with: 5)
        end
        within '#collection-temporal-filter-container' do
          choose('Contains')
        end

        check('Granules')
        within '#granule-access-constraints-container' do
          fill_in('Minimum Value', with: 0)
        end
        within '#granule-temporal-filter-container' do
          choose('Disjoint')
        end

        click_on 'Submit'
      end

      it 'displays validation errors for the conditionally required fields' do
        within '#collection-access-constraints-container' do
          expect(page).to have_content('Minimum and Maximum values must be specified together.')
        end
        within '#granule-access-constraints-container' do
          expect(page).to have_content('Minimum and Maximum values must be specified together.')
        end

        within '#collection-temporal-filter-container' do
          expect(page).to have_content('Start Date, Stop Date, and Mask must be specified together.')
        end
        within '#granule-temporal-filter-container' do
          expect(page).to have_content('Start Date, Stop Date, and Mask must be specified together.')
        end
      end
    end

    context 'when attempting to submit a collection permission with incorrect Min and Max values' do
      before do
        within '#collection-access-constraints-container' do
          fill_in('Minimum Value', with: 20)
          fill_in('Maximum Value', with: 5)
        end

        check('Granules')
        within '#granule-access-constraints-container' do
          fill_in('Minimum Value', with: 9)
          fill_in('Maximum Value', with: 1)
        end

        click_on 'Submit'
      end

      it 'displays the appropriate validation errors for the Min and Max fields' do
        within '#collection-access-constraints-container' do
          expect(page).to have_content('Maximum value must be greater than or equal to Minimum value.')
        end
        within '#granule-access-constraints-container' do
          expect(page).to have_content('Maximum value must be greater than or equal to Minimum value.')
        end
      end
    end

    context 'when attempting to submit a collection permission with incorrect Start and Stop Dates' do
      before do
        within '#collection-temporal-filter-container' do
          fill_in 'Start Date', with: '2020-04-27T00:00:00Z'
          fill_in 'Stop Date', with: '2020-03-01T00:00:00Z'
          choose 'Contains'
        end

        check('Granules')
        within '#granule-temporal-filter-container' do
          fill_in 'Start Date', with: '2020-04-27T00:00:00Z'
          fill_in 'Stop Date', with: '2020-03-01T00:00:00Z'
          choose 'Disjoint'
        end
      end

      it 'displays the appropriate validation errors for the Start and Stop Date fields' do
        within '#collection-temporal-filter-container' do
          expect(page).to have_content('Start Date must be earlier than Stop Date.')
        end
        within '#granule-temporal-filter-container' do
          expect(page).to have_content('Start Date must be earlier than Stop Date.')
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
