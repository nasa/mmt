# test for index page, created in MMT-507

require 'rails_helper'

describe 'Viewing Collection Permissions', reset_provider: true do
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
        all_permissions_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/get_permissions_index_regular.json'))
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
        all_permissions_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/get_permissions_index_w_permutations.json'))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).and_return(all_permissions_response)

        visit permissions_path
      end

      it 'displays the table of collection permissions with the correct summaries' do
        within '#custom-permissions-table' do
          within 'tbody > tr:nth-child(1)' do
            expect(page).to have_content('Test colperm 20')

            within 'td:nth-child(2)' do
              expect(page).to have_content('Search & Order')
              expect(page).to have_no_content('Create')
            end
          end

          within 'tbody > tr:nth-child(2)' do
            expect(page).to have_content('Test colperm 21')

            within 'td:nth-child(2)' do
              expect(page).to have_content('Search')
            end
          end

          within 'tbody > tr:nth-child(3)' do
            expect(page).to have_content('Test colperm 22')

            within 'td:nth-child(2)' do
              expect(page).to have_content('Search & Order')
              expect(page).to have_no_content('Delete')
              expect(page).to have_no_content('Create')
              expect(page).to have_no_content('Update')
            end
          end

          within 'tbody > tr:nth-child(4)' do
            expect(page).to have_content('Test colperm 23')

            within 'td:nth-child(2)' do
              expect(page).to have_content('Search')
            end
          end

          within 'tbody > tr:nth-child(5)' do
            expect(page).to have_content('Test colperm 24')

            within 'td:nth-child(2)' do
              expect(page).to have_content('Search & Order')
              expect(page).to have_no_content('Delete')
              expect(page).to have_no_content('Update')
              expect(page).to have_no_content('Create')
            end
          end
        end
      end
    end
  end

  context 'when viewing the collection permission show page', js: true do
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

    context 'when the collection permission only has read and order permissions' do
      before do
        @collection_permission_1_name = 'Testing Collection Permission 01'

        collection_permission_1 = {
          group_permissions: [{
            user_type: 'guest',
            permissions: [ 'read' ]
          }, {
            user_type: 'registered',
            permissions: [ 'read', 'order' ]
          }, {
            group_id: group1_id,
            permissions: [ 'read', 'order' ]
          }, {
            group_id: group2_id,
            permissions: [ 'read' ]
          }, {
            group_id: group3_id,
            permissions: [ 'read', 'order' ]
          }],
          catalog_item_identity: {
            'name': @collection_permission_1_name,
            'provider_id': 'MMT_2',
            'collection_applicable': true,
            'granule_applicable': true,
            'granule_identifier': {
              'access_value': {
                'min_value': 1.1,
                'max_value': 8.8,
                'include_undefined_value': true
              }
            }
          }
        }

        @collection_permission_1 = cmr_client.add_group_permissions(collection_permission_1, 'access_token').body

        wait_for_cmr

        visit permission_path(@collection_permission_1['concept_id'])
      end

      it 'displays the permission show page with appropriate information and groups' do
        expect(page).to have_content(@collection_permission_1_name)
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
      before do
        # while we can use stubbed groups for collection permissions, it seems
        # that we need to have ingested collections to create a collection
        # permission if it has selected collections
        ingest_response, @concept_response_1 = publish_draft
        ingest_response, @concept_response_2 = publish_draft
        ingest_response, @concept_response_3 = publish_draft

        wait_for_cmr

        @collection_permission_2_name = 'Testing Collection Permission Show Permutations'

        collection_permission_2 = {
          group_permissions: [{
            user_type: 'guest',
            permissions: [ 'read' ]
          }, {
            user_type: 'registered',
            permissions: [ 'order', 'read' ]
          }, {
            group_id: group3_id,
            permissions: [ 'delete', 'update', 'order', 'read', 'create' ]
          }, {
            group_id: group2_id,
            permissions: []
          }, {
            group_id: group1_id,
            permissions: [ 'delete', 'update', 'order', 'read', 'create' ]
          }],
          catalog_item_identity: {
            'name': @collection_permission_2_name,
            'provider_id': 'MMT_2',
            'granule_applicable': false,
            'collection_applicable': true,
            'collection_identifier': {
              'entry_titles': [
                @concept_response_1.body['EntryTitle'],
                @concept_response_2.body['EntryTitle'],
                @concept_response_3.body['EntryTitle']
              ],
              'access_value': {
                'min_value': 5.0,
                'max_value': 25.0,
                'include_undefined_value': true
              }
            }
          }
        }

        @collection_permission_2 = cmr_client.add_group_permissions(collection_permission_2, 'access_token').body

        wait_for_cmr

        visit permission_path(@collection_permission_2['concept_id'])
      end

      it 'displays the permission show page with appropriate information and groups' do
        expect(page).to have_content(@collection_permission_2_name)
        expect(page).to have_content('Permission Type | Search & Order | MMT_2')

        expect(page).to have_content('Collections | 3 Selected Collections')
        expect(page).to have_content("#{@concept_response_1.body['ShortName']}_#{@concept_response_1.body['Version']}")
        expect(page).to have_content("#{@concept_response_2.body['ShortName']}_#{@concept_response_2.body['Version']}")
        expect(page).to have_content("#{@concept_response_3.body['ShortName']}_#{@concept_response_3.body['Version']}")
        expect(page).to have_content('Collections Access Constraint Filter: Match range 5.0 to 25.0, Include Undefined')

        expect(page).to have_content('Granules | No Access to Granules')
        expect(page).to have_no_content('Granules Access Constraint Filter')

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

          within 'tbody' do
            expect(page).to have_no_content('Group 2 (8)')
          end
        end
      end
    end

    context 'when the collection permission has no access to collections' do
      before do
        @collection_permission_3_name = 'Testing Collection Permission No Collections Access'

        collection_permission_3 = {
          group_permissions: [{
            user_type: 'guest',
            permissions: [ 'read' ]
          }, {
            user_type: 'registered',
            permissions: [ 'read', 'order' ]
          }, {
            group_id: group3_id,
            permissions: [ 'read', 'order' ]
          }],
          catalog_item_identity: {
            'name': @collection_permission_3_name,
            'provider_id': 'MMT_2',
            'granule_applicable': true,
            'collection_applicable': false
          }
        }

        @collection_permission_3 = cmr_client.add_group_permissions(collection_permission_3, 'access_token').body

        wait_for_cmr

        visit permission_path(@collection_permission_3['concept_id'])
      end

      it 'displays the permission show page with appropriate information and groups' do
        expect(page).to have_content(@collection_permission_3_name)
        expect(page).to have_content('Permission Type | Search & Order | MMT_2')

        expect(page).to have_content('Collections | No Access to Collections')
        expect(page).to have_no_content('Collections Access Constraint Filter')

        expect(page).to have_content('Granules | All Granules in Selected Collection Records')

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
          within 'tbody > tr:nth-child(3)' do
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
        end
      end
    end
  end
end
