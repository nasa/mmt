# MMT-507, 508, 152, 153, 170, 171, 509, 512
# tests for create, show, edit, update, delete

require 'rails_helper'

describe 'Collection Permissions', reset_provider: true, js: true do
  let(:group1_id) { 'AG1200000069-MMT_2' }
  let(:group2_id) { 'AG1200000070-MMT_2' }
  let(:group3_id) { 'AG1200000071-MMT_2' }

  before do
    # stubs for groups
    groups_list_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/get_cmr_groups_response.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).and_return(groups_list_response)

    group1_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/group1.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group1_id, 'access_token').and_return(group1_response)

    group2_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/group2.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group2_id, 'access_token').and_return(group2_response)

    group3_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/group3.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(group3_id, 'access_token').and_return(group3_response)

    login
  end

  context 'when creating a new collection permission with complete information' do
    let(:new_collection_permission_name) { 'New Collection Permission 01' }
    before do
      visit new_permission_path

      fill_in('Name', with: new_collection_permission_name)

      select('All Collections', from: 'Collections')
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

      wait_for_cmr
    end

    it 'successfully creates the collection permission and redirects to the show page and displaying the collection permission information' do
      expect(page).to have_content('Collection Permission was successfully created.')

      expect(page).to have_content(new_collection_permission_name)
      expect(page).to have_content('Permission Type | Search & Order | MMT_2')

      expect(page).to have_content('Collections | All Collections')
      expect(page).to have_content('Collections Access Constraint Filter: Match range 5.0 to 25.0, Include Undefined')

      expect(page).to have_content('Granules | No Access to Granules')
      expect(page).to have_no_content('Granules Access Constraint Filter')

      within '#permission-groups-table' do
        expect(page).to have_content('All Guest Users')
        expect(page).to have_content('All Registered Users')
        expect(page).to have_content('Group 1 (2)')
      end
    end
  end

  context 'when updating a collection permission' do
    before :all do
      previous_collection_permission = {
        group_permissions: [ {
          user_type: 'guest',
          permissions: [ 'read' ]
        }, {
          user_type: 'registered',
          permissions: [ 'read', 'order' ]
        }, {
          group_id: "AG1200000069-MMT_2",
          permissions: [ 'order' ]
        }],
        catalog_item_identity: {
          'name': 'Collection Permission to Edit 01',
          'provider_id': 'MMT_2',
          'granule_applicable': false,
          'collection_applicable': true,
          'collection_identifier': {
            'access_value': {
              'min_value': 5.0,
              'max_value': 25.0,
              'include_undefined_value': true
            }
          }
        }
      }

      @collection_permission_for_edit = cmr_client.add_group_permissions(previous_collection_permission, 'access_token').body

      # while we can use stubbed groups for collection permissions, it seems
      # that we need to have ingested collections to create a collection
      # permission if it has selected collections
      ingest_response, concept_response_1 = publish_draft
      @entry_id_1 = "#{concept_response_1.body['ShortName']}_#{concept_response_1.body['Version']}"
      ingest_response, concept_response_2 = publish_draft
      @entry_id_2 = "#{concept_response_2.body['ShortName']}_#{concept_response_2.body['Version']}"
      ingest_response, concept_response_3 = publish_draft
      @entry_id_3 = "#{concept_response_3.body['ShortName']}_#{concept_response_3.body['Version']}"

      wait_for_cmr
    end

    context 'when visiting the edit page' do
      before do
        visit edit_permission_path(@collection_permission_for_edit['concept_id'])
      end

      it 'populates the form with the collection permission information' do
        expect(page).to have_field('Name', with: 'Collection Permission to Edit 01', readonly: true)

        expect(page).to have_select('Collections', selected: 'All Collections')
        expect(page).to have_no_css('#collectionsChooser')

        expect(page).to have_select('Granules', selected: 'No Access to Granules')

        within '#search_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: 'All Guest Users')
        end

        within '#search_and_order_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: 'All Registered Users')
          expect(page).to have_css('li.select2-selection__choice', text: 'Group 1')
        end
      end

      context 'when updating the collection permission to have no access to collections' do
        before do
          select('No Access to Collections', from: 'Collections')

          select('All Granules', from: 'Granules')
          within '#granule_constraint_values' do
            fill_in('Minimum Access Constraint Value', with: 1.1)
            fill_in('Maximum Access Constraint Value', with: 8.8)
            check('Include Undefined')
          end

          select('Group 2', from: 'Search and Order')

          click_on 'Submit'

          wait_for_cmr
        end

        it 'successfully updates the collection permission and redirects to the show page and displaying the collection permission information' do
          expect(page).to have_content('Collection Permission to Edit 01')

          expect(page).to have_content('Collections | No Access to Collections')
          expect(page).to have_no_content('Collections Access Constraint Filter')

          expect(page).to have_content('Granules | All Granules in Selected Collection Records')
          expect(page).to have_content('Granules Access Constraint Filter: Match range 1.1 to 8.8, Include Undefined')

          within '#permission-groups-table' do
            expect(page).to have_content('All Guest Users')
            expect(page).to have_content('All Registered Users')
            expect(page).to have_content('Group 1 (2)')
            expect(page).to have_content('Group 2 (8)')
          end
        end

        context 'when updating the collection permission with selected collections' do
          before do
            visit edit_permission_path(@collection_permission_for_edit['concept_id'])

            select('Selected Collections', from: 'Collections')
            # choose the collections
            within '#collectionsChooser' do
              # selecting each individually as it seems more robust.
              select(@entry_id_1, from: 'Available collections')
              find('button[title=add]').click
              select(@entry_id_2, from: 'Available collections')
              find('button[title=add]').click
              select(@entry_id_3, from: 'Available collections')
              find('button[title=add]').click
            end

            within '#search_and_order_groups_cell' do
              page.find('.select2-selection__choice[title="Group 1"] > .select2-selection__choice__remove').click
            end
            select('Group 3', from: 'Search and Order')

            click_on 'Submit'

            wait_for_cmr
          end

          it 'successfully updates the collection permission and redirects to the show page and displaying the collection permission information' do
            expect(page).to have_content('Collection Permission to Edit 01')

            expect(page).to have_content('Collections | 3 Selected Collections')
            expect(page).to have_content(@entry_id_1)
            expect(page).to have_content(@entry_id_2)
            expect(page).to have_content(@entry_id_3)

            expect(page).to have_content('Granules | All Granules in Selected Collection Records')
            expect(page).to have_content('Granules Access Constraint Filter: Match range 1.1 to 8.8, Include Undefined')

            within '#permission-groups-table' do
              expect(page).to have_content('All Guest Users')
              expect(page).to have_content('All Registered Users')
              expect(page).to have_content('Group 2 (8)')
              expect(page).to have_content('Group 3 (4)')
              expect(page).to have_no_content('Group 1 (2)')
            end
          end
        end
      end
    end
  end

  context 'when deleting a collection permission' do
    before do
      @collection_permission_to_delete = add_associated_permissions_to_group(group_id: group3_id, name: 'Testing Delete Collection Permission 01')

      visit permission_path(@collection_permission_to_delete['concept_id'])

      click_on 'Delete'
      click_on 'Yes'

      wait_for_cmr
    end

    it 'successfully deletes the collection permission and redirects to the index page and does not display the deleted collection permission' do
      expect(page).to have_content('Collection Permission was successfully deleted.')
      expect(page).to have_css('h2', text: 'Collection Permissions')
      expect(page).to have_no_content('Testing Delete Collection Permission 01')
    end
  end
end
