# test for index page, created in MMT-507
# when ready, can include tests for guest users and registered users permissions page(s)

require 'rails_helper'

describe 'Viewing Collection Permissions' do
  before do
    login
  end

  # In PUMP, collection permissions (aka catalog item ACLs) can be granted
  # View (aka read or search), Order, Create, Update, and Delete permissions
  # MMT only uses the View and Order permissions because the others don't
  # change any access privileges. We should test both

  context 'when viewing the collection permissions index page' do
    context 'when the collection permissions only have Read and Order permissions' do
      before do
        all_permissions_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/collection_permissions/get_permissions_index_regular.json'))))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).and_return(all_permissions_response)

        visit permissions_path
      end

      it 'displays the table of collection permissions with the correct summaries' do
        within '#custom-permissions-table' do
          within 'tbody > tr:nth-child(1)' do
            expect(page).to have_content('perm 01')
            expect(page).to have_content('Search & Order')
          end

          within 'tbody > tr:nth-child(2)' do
            expect(page).to have_content('perm 02')
            expect(page).to have_content('Search & Order')
          end

          within 'tbody > tr:nth-child(3)' do
            expect(page).to have_content('perm 03')
            expect(page).to have_content('Search & Order')
          end

          within 'tbody > tr:nth-child(4)' do
            expect(page).to have_content('perm 04')
            expect(page).to have_content('Search')
          end

          within 'tbody > tr:nth-child(5)' do
            expect(page).to have_content('perm 05')
            expect(page).to have_content('Search & Order')
          end

          within 'tbody > tr:nth-child(6)' do
            expect(page).to have_content('perm 06')
            expect(page).to have_content('Search & Order')
          end

          within 'tbody > tr:nth-child(7)' do
            expect(page).to have_content('perm 07')
            expect(page).to have_content('Search & Order')
          end
        end
      end

    end

    context 'when the collection permissions also have Create, Update, and Delete permissions in alternative order' do
      before do
        all_permissions_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/collection_permissions/get_permissions_index_w_permutations.json'))))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).and_return(all_permissions_response)

        visit permissions_path
      end

      it 'displays the table of collection permissions with the correct summaries' do
        within '#custom-permissions-table' do
          within 'tbody > tr:nth-child(1)' do
            expect(page).to have_content('Test colperm 20')
            expect(page).to have_content('Search & Order')
          end

          within 'tbody > tr:nth-child(2)' do
            expect(page).to have_content('Test colperm 21')
            expect(page).to have_content('Search')
          end

          within 'tbody > tr:nth-child(3)' do
            expect(page).to have_content('Test colperm 22')
            expect(page).to have_content('Search & Order')
          end

          within 'tbody > tr:nth-child(4)' do
            expect(page).to have_content('Test colperm 23')
            expect(page).to have_content('Search')
          end

          within 'tbody > tr:nth-child(5)' do
            expect(page).to have_content('Test colperm 24')
            expect(page).to have_content('Search & Order')
          end
        end
      end
    end
  end

  context 'when viewing the collection permission show page', js: true do
    before do
      # stubs for 3 groups
      group1 = '{"name":"Group 1","description":"desc gp 1","provider_id":"MMT_2","num_members":2}'
      group1_id = 'AG1200000069-MMT_2'
      group1_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group1)))

      group2 = '{"name":"Group 2","description":"desc gp 2","provider_id":"MMT_2","num_members":8}'
      group2_id = 'AG1200000070-MMT_2'
      group2_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group2)))

      group3 = '{"name":"Group 3","description":"desc gp 3","provider_id":"MMT_2","num_members":4}'
      group3_id = 'AG1200000071-MMT_2'
      group3_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group3)))

      allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group1_id, 'access_token').and_return(group1_response)
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group2_id, 'access_token').and_return(group2_response)
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group3_id, 'access_token').and_return(group3_response)
    end

    context 'when the collection permission only has read and order permissions' do
      let(:perm_concept) { 'ACL2222-CMR' }
      before do
        permission_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/collection_permissions/permission_show_regular.json'))))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_permission).with(perm_concept, 'access_token').and_return(permission_response)

        visit permission_path(perm_concept)
      end

      it 'displays the permission show page with appropriate information and groups' do
        expect(page).to have_content('Testing Permission View 05')
        expect(page).to have_content('Permission Type | Search & Order | MMT_2')

        expect(page).to have_content('Collections | All Collections')
        expect(page).to have_no_content('Collections Access Constraint Filter')

        expect(page).to have_content('Granules | All Granules in Selected Collection Records')
        expect(page).to have_content('Granules Access Constraint Filter: Match range 1.1 to 8.8, Include Undefined')

        within '#permission-groups-table' do
          # Search and Order groups
          within 'tbody > tr:nth-child(1)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('All Registered Users')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody > tr:nth-child(2)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 1 (2)')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody > tr:nth-child(3)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 3 (4)')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          # Search only groups
          within 'tbody > tr:nth-child(4)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('All Guest Users')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_no_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody > tr:nth-child(5)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 2 (8)')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_no_css('i.eui-icon.eui-check-o.icon-green')
            end
          end
        end
      end
    end

    # PUMP can also add group permissions where the group has empty permissions so we should test that as well
    context 'when the collection permission has create, update, and delete permissions as well as groups with empty permissions' do
      let(:perm_concept) { 'ACL3333-CMR' }
      # create a mock/fixture that has at least one group with empty permissions
      # and at least one group with the extra permissions
      before do
        collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

        permission_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/collection_permissions/permission_show_w_permutations.json'))))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_permission).with(perm_concept, 'access_token').and_return(permission_response)

        visit permission_path(perm_concept)
      end

      it 'displays the permission show page with appropriate information and groups' do
        expect(page).to have_content('Testing Permission View Permutations')
        expect(page).to have_content('Permission Type | Search & Order | MMT_2')

        expect(page).to have_content('Collections | 6 Selected Collections')
        expect(page).to have_content("lorem_223, ID_1, Matthew'sTest_2, testing 02_01, testing 03_002, and New Testy Test_02")
        expect(page).to have_content('Collections Access Constraint Filter: Match range 5.0 to 25.0, Include Undefined')

        expect(page).to have_content('Granules | No Access to Granules')
        expect(page).to have_no_content('Granules Access Constraint Filter')

        within '#permission-groups-table' do
          # expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
          # expect(page).to have_no_css('i.eui-icon.eui-check-o.icon-green')

          # search and order
          expect(page).to have_content('All Registered Users')
          expect(page).to have_content('Group 3 (4)')
          expect(page).to have_content('Group 2 (8)')
          expect(page).to have_content('Group 1 (2)')
          expect(page).to have_content('All Guest Users')

          # Search and Order groups
          within 'tbody > tr:nth-child(1)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('All Registered Users')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody > tr:nth-child(2)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 3 (4)')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody > tr:nth-child(3)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 1 (2)')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          # Search only groups
          within 'tbody > tr:nth-child(4)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('All Guest Users')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_no_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody > tr:nth-child(5)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 2 (8)')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_no_css('i.eui-icon.eui-check-o.icon-green')
            end
          end
        end
      end
    end
  end
end
