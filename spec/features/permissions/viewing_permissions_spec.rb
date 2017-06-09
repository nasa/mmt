# test for index page, created in MMT-507

require 'rails_helper'

describe 'Viewing Collection Permissions', reset_provider: true do
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

    login
  end

  # In PUMP, collection permissions (aka catalog item ACLs) can be granted
  # View (aka read or search), Order, Create, Update, and Delete permissions
  # MMT only uses the View and Order permissions because the others don't
  # change any access privileges. We should test both

  context 'when viewing the collection permission show page', js: true do
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

        within '#granule-constraint-summary' do
          expect(page).to have_content('between 1.1 and 8.8')
          expect(page).to have_content('(or are undefined)')
        end

        within '#permission-groups-table' do
          # Search only groups
          within 'tbody > tr:nth-child(1)' do
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

          within 'tbody > tr:nth-child(2)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 2')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_no_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          # Search and Order groups
          within 'tbody > tr:nth-child(3)' do
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

          within 'tbody > tr:nth-child(4)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 1')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody > tr:nth-child(5)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 3')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end
        end
      end
    end

    # PUMP can also add group permissions where the group has empty permissions so we should test that as well
    context 'when the collection permission also has create, update, and delete permissions, permissions in alternative order, and groups with empty permissions' do
      before do
        # while we can use stubbed groups for collection permissions, it seems
        # that we need to have ingested collections to create a collection
        # permission if it has selected collections
        @ingest_response1, @concept_response_1 = publish_draft
        @ingest_response2, @concept_response_2 = publish_draft
        @ingest_response3, @concept_response_3 = publish_draft

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
            permissions: [ 'order' ]
          }],
          catalog_item_identity: {
            'name': @collection_permission_2_name,
            'provider_id': 'MMT_2',
            'granule_applicable': false,
            'collection_applicable': true,
            'collection_identifier': {
              'concept_ids': [
                @ingest_response1['concept-id'],
                @ingest_response2['concept-id'],
                @ingest_response3['concept-id']
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

        within '#granule-constraint-summary' do
          expect(page).to have_content('This permission does not grant access to granules.')
        end

        within '#permission-groups-table' do
          # Search only groups
          within 'tbody > tr:nth-child(1)' do
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

          # Search and Order groups
          within 'tbody > tr:nth-child(2)' do
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

          within 'tbody > tr:nth-child(3)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 3')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody > tr:nth-child(4)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 1')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end

          within 'tbody' do
            expect(page).to have_no_content('Group 2')
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

        within '#collection-constraint-summary' do
          expect(page).to have_content('This permission does not grant access to collections.')
        end

        within '#permission-groups-table' do
          # Search only groups
          within 'tbody > tr:nth-child(1)' do
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

          # Search and Order groups
          within 'tbody > tr:nth-child(2)' do
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

          within 'tbody > tr:nth-child(3)' do
            within 'td:nth-child(1)' do
              expect(page).to have_content('Group 3')
            end
            within 'td:nth-child(2)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
            within 'td:nth-child(3)' do
              expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
            end
          end
        end
      end
    end
  end
end
