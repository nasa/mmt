# MMT-507, 508, 152, 153, 170, 171, 509, 512
# tests for create, show, edit, update

require 'rails_helper'

describe 'Creating Collection Permissions', js: true do
  permission_name = 'Test Permission 1'

  context 'when creating a new permission with complete information' do
    before do
      login

      # stub for collections
      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

      # stub for a list of groups
      groups_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/permissions/get_cmr_groups_response.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).and_return(groups_response)

      # stub for create permission response
      create_success = '{"revision_id":1,"concept_id":"ACL12345-CMR"}'
      permission_concept_id = 'ACL12345-CMR'
      create_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(create_success)))
      allow_any_instance_of(Cmr::CmrClient).to receive(:add_group_permissions).and_return(create_response)

      # stub for get permission with the concept id we are providing above
      permission_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/permissions/permission_with_entry_titles.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_permission).with('ACL12345-CMR', 'access_token').and_return(permission_response)

      # stub for 2 of the groups
      group1 = '{"name":"Group 1","description":"desc gp 1","provider_id":"MMT_2","num_members":2}'
      group1_id = 'AG1200000069-MMT_2'
      group1_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group1)))

      group2 = '{"name":"Group 2","description":"desc gp 2","provider_id":"MMT_2","num_members":8}'
      group2_id = 'AG1200000070-MMT_2'
      group2_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group2)))

      allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group1_id, 'access_token').and_return(group1_response)
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group2_id, 'access_token').and_return(group2_response)

      visit new_permission_path

      fill_in 'Name', with: permission_name

      select('Selected Collections', from: 'Collections')
      # choose the collections
      within '#collectionsChooser' do
        # selecting each individually as it seems more robust.
        # I was using `page.all('#collectionsChooser_fromList > option').select`, and that worked previously but is not working now
        select('lorem_223', from: 'Available collections')
        find('button[title=add]').click
        select('ID_1', from: 'Available collections')
        find('button[title=add]').click
        select("Matthew'sTest_2", from: 'Available collections')
        find('button[title=add]').click
        select('testing 02_01', from: 'Available collections')
        find('button[title=add]').click
        select('testing 03_002', from: 'Available collections')
        find('button[title=add]').click
        select('New Testy Test_02', from: 'Available collections')
        find('button[title=add]').click
      end

      within '#collection_constraint_values' do
        fill_in('Minimum Access Constraint Value', with: 5)
        fill_in('Maximum Access Constraint Value', with: 25)
        check('Include Undefined')
      end

      select('No Access to Granules', from: 'Granules')

      within '#permission-form-groups-table' do
        select('All Guest Users', from: 'Search')
        select('All Registered Users', from: 'Search and Order')
        select('Group 1', from: 'Search and Order')
      end

      click_on 'Submit'
    end

    it 'displays a success message' do
      expect(page).to have_content('Permission was successfully created.')
    end

    it 'redirects to the permission show page and displays the permission information' do
      expect(page).to have_content(permission_name)
      expect(page).to have_content('Permission Type | Search & Order | MMT_2')

      expect(page).to have_content('Collections | 6 Selected Collections')
      expect(page).to have_content("lorem_223, ID_1, Matthew'sTest_2, testing 02_01, testing 03_002, and New Testy Test_02")
      expect(page).to have_content('Collections Access Constraint Filter: Match range 5.0 to 25.0, Include Undefined')

      expect(page).to have_content('Granules | No Access to Granules')
      expect(page).to have_no_content('Granules Access Constraint Filter')

      within '#permission-groups-table' do
        # TODO is there a way to test the icons?
        expect(page).to have_content('All Guest Users')
        expect(page).to have_content('All Registered Users')
        expect(page).to have_content('Group 1 (2)')
      end
    end

    context 'when viewing the group show page' do
      before do
        group1 = '{"name":"Group 1","description":"desc gp 1","provider_id":"MMT_2","num_members":2}'
        group1_id = 'AG1200000069-MMT_2'
        group1_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group1)))

        allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group1_id, 'access_token').and_return(group1_response)

        associated_permission_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/permissions/associated_permissions.json'))))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_group_permissions).with(group1_id, 'access_token').and_return(associated_permission_response)

        click_on 'Group 1'
      end

      it 'displays the associated permission' do
        expect(page).to have_content 'Associated Permissions Test Permission 1'
      end
    end

    context 'when clicking the edit permission button' do
      before do
        click_on 'Edit'
      end

      it 'populates the form with the permission information' do
        expect(page).to have_field('Name', with: permission_name, readonly: true)

        expect(page).to have_select('Collections', selected: 'Selected Collections')
        expect(page).to have_select('collectionsChooser_toList', with_options: ["lorem_223 | ipsum", "ID_1 | Mark's Test", "Matthew'sTest_2 | Matthew's Test", "testing 02_01 | My testing title 02", "testing 03_002 | Test test title 03", "New Testy Test_02 | Testy long entry title"])

        expect(page).to have_select('Granules', selected: 'No Access to Granules')

        within '#search_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: 'All Guest Users')
        end

        within '#search_and_order_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: 'All Registered Users')
          expect(page).to have_css('li.select2-selection__choice', text: 'Group 1')
        end
      end

      context 'when updating the permission' do
        before do
          permission_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/permissions/permission_no_entry_titles.json'))))
          allow_any_instance_of(Cmr::CmrClient).to receive(:get_permission).and_return(permission_response)

          update_success = '{"revision_id":2,"concept_id":"ACL12345-CMR"}'
          update_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(update_success)))
          allow_any_instance_of(Cmr::CmrClient).to receive(:update_permission).and_return(update_response)

          select('All Collections', from: 'Collections')
          within '#collection_constraint_values' do
            fill_in('Minimum Access Constraint Value', with: '')
            fill_in('Maximum Access Constraint Value', with: '')
            uncheck('Include Undefined')
          end

          select('All Granules', from: 'Granules')
          within '#granule_constraint_values' do
            fill_in('Minimum Access Constraint Value', with: 1.1)
            fill_in('Maximum Access Constraint Value', with: 8.8)
            check('Include Undefined')
          end

          select('Group 2', from: 'Search and Order')
          within '#search_and_order_groups_cell' do
            page.find('.select2-selection__choice[title="Group 1"] > .select2-selection__choice__remove').click
          end

          click_on 'Submit'
        end

        it 'displays a success message' do
          expect(page).to have_content('Permission was successfully updated.')
        end

        it 'redirects to the permission show page and displays the permission information' do
          expect(page).to have_content(permission_name)
          expect(page).to have_content('Permission Type | Search & Order | MMT_2')

          expect(page).to have_content('Collections | All Collections')
          expect(page).to have_no_content('Collections Access Constraint Filter')

          expect(page).to have_content('Granules | All Granules in Selected Collection Records')
          expect(page).to have_content('Granules Access Constraint Filter: Match range 1.1 to 8.8, Include Undefined')


          within '#permission-groups-table' do
            # TODO is there a way to test the icons?
            expect(page).to have_content('All Guest Users')
            expect(page).to have_content('All Registered Users')
            expect(page).to have_content('Group 2 (8)')
          end
        end
      end
    end

    context 'when deleting the permission with negative confirmation' do
      before do
        click_on 'Delete'
        click_on 'No'
      end

      it 'closes the confirmation dialog and does not delete the permission' do
        expect(page).to have_no_content('Are you sure you want to delete this permission?')
        expect(page).to have_selector('#delete-permission-modal', visible: false)
        expect(page).to have_content(permission_name)
        expect(page).to have_link('Edit')
        expect(page).to have_link('Delete')
      end
    end

    context 'when deleting the permission with positive confirmation' do
      before do
        delete_success = '{"revision_id":3,"concept_id":"ACL12345-CMR"}' # should make sure that concept_id is with underscore, not dash. the CMR docs have dash in the delete response, but everything else is underscore
        delete_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(delete_success)))
        allow_any_instance_of(Cmr::CmrClient).to receive(:delete_permission).and_return(delete_response) # method name being received must match the cmr_client delete method

        click_on 'Delete'
        click_on 'Yes'
      end

      it 'redirects to the index page and does not display the current permission' do
        expect(page).to have_no_content(permission_name)
      end
    end
  end
end
