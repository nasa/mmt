# MMT-507, 508, 152, 153, 170
# tests for create, show, edit, update

require 'rails_helper'

describe 'Creating Permissions', js: true do
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
        page.all('#collectionsChooser_fromList > option').select
        # click_on 'Add collection(s)' # TODO need to wait for 508 to use this
        click_on '→' # TODO change when 508 updated
      end

      select('No Access to Granules', from: 'Granules')

      within '#permission-form-groups-table' do
        select('All Guest Users', from: 'Search')
        select('Group 1', from: 'Search')
        select('All Registered Users', from: 'Search and Order')
      end

      screenshot_and_save_page

      click_on 'Save'
    end

    it 'displays a success message' do
      expect(page).to have_content('Permission was successfully created.')
    end

    it 'redirects to the permission show page and displays the permission information' do
      within 'main > header' do
        expect(page).to have_content(permission_name)
        expect(page).to have_content('Permission Type: Search & Order | MMT_2')
      end

      expect(page).to have_content('Collections | 6 Selected Entry IDs')
      expect(page).to have_content("lorem_223, ID_1, Matthew'sTest_2, testing 02_01, testing 03_002, New Testy Test_02")
      # if the collection entry_ids get listed in order then these can be removed
      # expect(page).to have_content('lorem_223')
      # expect(page).to have_content('ID_1')
      # expect(page).to have_content("Matthew'sTest_2")
      # expect(page).to have_content('testing 02_01')
      # expect(page).to have_content('testing 03_002')
      # expect(page).to have_content('New Testy Test_02')

      expect(page).to have_content('Granules | No Access to Granules')

      within '#permission-groups-table' do
        # TODO is there a way to test the icons?
        expect(page).to have_content('All Guest Users')
        expect(page).to have_content('All Registered Users')
        expect(page).to have_content('Group 1 (2)')
      end
    end


    context 'when clicking the edit permission button' do
      before do
        click_on 'Edit Permission'
      end

      it 'populates the form with the permission information' do
        expect(page).to have_field('Name', with: permission_name, readonly: true)

        expect(page).to have_select('Collections', selected: 'Selected Collections')
        # after merge/rebase of 508, add the selected collections in the box
        expect(page).to have_select('Granules', selected: 'No Access to Granules')

        # these did not work, why?
        # expect(page).to have_select('Search', selected: 'All Guest Users')
        # expect(page).to have_select('Search', selected: 'Group 1')
        within '#search_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: 'All Guest Users')
          expect(page).to have_css('li.select2-selection__choice', text: 'Group 1')
        end

        expect(page).to have_select('Search and Order', selected: 'All Registered Users')
        # this might be needed
        # within '#search_and_order_groups_cell' do
        #   expect(page).to have_css('li.select2-selection__choice', text: 'All Registered Users')
        # end
      end

      context 'when updating the permission' do
        before do
          permission_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/permissions/permission_no_entry_titles.json'))))
          allow_any_instance_of(Cmr::CmrClient).to receive(:get_permission).and_return(permission_response)

          update_success = '{"revision_id":2,"concept_id":"ACL12345-CMR"}'
          update_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(update_success)))
          allow_any_instance_of(Cmr::CmrClient).to receive(:update_permission).and_return(update_response)

          select('All Collections', from: 'Collections')
          select('All Granules', from: 'Granules')

          within '#search_groups_cell' do
            page.find('.select2-selection__choice[title="Group 1"] > .select2-selection__choice__remove').click
          end
          select('Group 2', from: 'Search and Order')

          click_on 'Save'
        end

        it 'displays a success message' do
          expect(page).to have_content('Permission was successfully updated.')
        end

        it 'redirects to the permission show page and displays the permission information' do
          within 'main > header' do
            expect(page).to have_content(permission_name)
            expect(page).to have_content('Permission Type: Search & Order | MMT_2')
          end

          expect(page).to have_content('Collections | All Collections')
          expect(page).to have_content('Granules | All Granules in Selected Collection Records')

          within '#permission-groups-table' do
            # TODO is there a way to test the icons?
            expect(page).to have_content('All Guest Users')
            expect(page).to have_content('All Registered Users')
            expect(page).to have_content('Group 2 (8)')
          end
        end
      end
    end
  end
end