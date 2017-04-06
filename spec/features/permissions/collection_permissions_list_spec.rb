
require 'rails_helper'

describe 'Collection Permissions Index page', reset_provider: true do
  let(:group1_id) { 'AG1200000069-MMT_2' }
  let(:group2_id) { 'AG1200000070-MMT_2' }
  let(:group3_id) { 'AG1200000071-MMT_2' }

  before do
    # stubs for 3 groups
    group1_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/group1.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group1_id, 'access_token').and_return(group1_response)

    group2_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/group2.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group2_id, 'access_token').and_return(group2_response)

    group3_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/group3.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group3_id, 'access_token').and_return(group3_response)
  end

  # In PUMP, collection permissions (aka catalog item ACLs) can be granted
  # View (aka read or search), Order, Create, Update, and Delete permissions
  # MMT only uses the View and Order permissions because the others don't
  # change any access privileges. We should test both

  context 'when viewing the collection permissions index page' do
    before do
      login
    end

    context 'when there are no permissions' do
      before do
        visit permissions_path
      end

      it 'indicates there are no permissions' do
        within '#custom-permissions-table' do
          expect(page).to have_content('No permissions found.')
        end
      end

      context 'when the collection permissions only have Read and Order permissions' do
        before do
          collection_permission_1 = add_associated_permissions_to_group(group_id: group1_id, name: 'Testing Collection Permission Index Regular 01', permissions: [ 'read' ])
          collection_permission_2 = add_associated_permissions_to_group(group_id: group2_id, name: 'Testing Collection Permission Index Regular 02', permissions: [ 'read', 'order' ])
          collection_permission_3 = add_associated_permissions_to_group(group_id: group3_id, name: 'Testing Collection Permission Index Regular 03', permissions: [ 'read', 'order' ])

          visit permissions_path
        end

        it 'displays the table of collection permissions with the correct summaries' do
          within '#custom-permissions-table' do
            within 'tbody > tr:nth-child(1)' do
              expect(page).to have_content('Testing Collection Permission Index Regular 01')

              within 'td:nth-child(2)' do
                expect(page).to have_content('Search')
                expect(page).to have_no_content('Order')
              end
            end

            within 'tbody > tr:nth-child(2)' do
              expect(page).to have_content('Testing Collection Permission Index Regular 02')
              within 'td:nth-child(2)' do
                expect(page).to have_content('Search & Order')
              end
            end

            within 'tbody > tr:nth-child(3)' do
              expect(page).to have_content('Testing Collection Permission Index Regular 03')
              within 'td:nth-child(2)' do
                expect(page).to have_content('Search & Order')
              end
            end
          end
        end

        context 'when the collection permissions also have Create, Update, and Delete permissions in alternative order' do
          before do
            collection_permission_4 = add_associated_permissions_to_group(group_id: group1_id, name: 'Testing Collection Permission Index empty permissions 01', permissions: [ ])
            collection_permission_5 = add_associated_permissions_to_group(group_id: group2_id, name: 'Testing Collection Permission Index Permutations 02', permissions: [ 'order', 'read', 'create' ])
            collection_permission_6 = add_associated_permissions_to_group(group_id: group3_id, name: 'Testing Collection Permission Index Permutations 03', permissions: [ 'read' ])
            collection_permission_7 = add_associated_permissions_to_group(group_id: group1_id, name: 'Testing Collection Permission Index Permutations 04', permissions: [ 'delete', 'update', 'order', 'read', 'create' ])

            visit permissions_path
          end

          it 'displays the table of collections with the correct summaries' do
            within '#custom-permissions-table' do
              within 'tbody > tr:nth-child(1)' do
                expect(page).to have_content('Testing Collection Permission Index empty permissions 01')

                within 'td:nth-child(2)' do
                  expect(page).to have_no_content('Search')
                  expect(page).to have_no_content('Order')
                end
              end

              within 'tbody > tr:nth-child(2)' do
                expect(page).to have_content('Testing Collection Permission Index Permutations 02')

                within 'td:nth-child(2)' do
                  expect(page).to have_content('Search & Order')
                end
              end

              within 'tbody > tr:nth-child(3)' do
                expect(page).to have_content('Testing Collection Permission Index Permutations 03')

                within 'td:nth-child(2)' do
                  expect(page).to have_content('Search')
                  expect(page).to have_no_content('Order')
                end
              end

              within 'tbody > tr:nth-child(4)' do
                expect(page).to have_content('Testing Collection Permission Index Permutations 04')

                within 'td:nth-child(2)' do
                  expect(page).to have_content('Search & Order')
                  expect(page).to have_no_content('Create')
                  expect(page).to have_no_content('Update')
                  expect(page).to have_no_content('Delete')
                end
              end

              within 'tbody > tr:nth-child(5)' do
                expect(page).to have_content('Testing Collection Permission Index Regular 01')

                within 'td:nth-child(2)' do
                  expect(page).to have_content('Search')
                  expect(page).to have_no_content('Order')
                end
              end

              within 'tbody > tr:nth-child(6)' do
                expect(page).to have_content('Testing Collection Permission Index Regular 02')

                within 'td:nth-child(2)' do
                  expect(page).to have_content('Search & Order')
                end
              end

              within 'tbody > tr:nth-child(7)' do
                expect(page).to have_content('Testing Collection Permission Index Regular 03')

                within 'td:nth-child(2)' do
                  expect(page).to have_content('Search & Order')
                end
              end
            end
          end
        end
      end
    end
  end
end
