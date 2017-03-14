# MMT-843
require 'rails_helper'

describe 'Updating Collection Permissions with System Groups', reset_provider: true do
  before :all do
    @group_name = random_group_name
    @group = create_group(name: @group_name, admin: false)

    wait_for_cmr

    @collection_permission_name = 'Testing Collection Permissions with System Groups'
    original_collection_permission = {
      group_permissions: [{
        group_id: @group['concept_id'],
        permissions: [ "read", "order" ]
      }, {
        group_id: 'AG1200000000-CMR', # Administrators
        permissions: [ "read", "order"]
      }, {
        group_id: 'AG1200000001-CMR', # Administrators_2
        permissions: [ "read" ]
      }],
      catalog_item_identity: {
        "name": @collection_permission_name,
        "provider_id": "MMT_2",
        "collection_applicable": true,
        "granule_applicable": false
      }
    }

    @collection_permission = cmr_client.add_group_permissions(original_collection_permission, 'access_token').body

    wait_for_cmr
  end

  context 'when logging in as a regular user and viewing the collection permission' do
    before do
      login

      visit permission_path(@collection_permission['concept_id'])
    end

    it 'displays the collection permission' do
      expect(page).to have_content(@collection_permission_name)
      expect(page).to have_content('Permission Type | Search & Order | MMT_2')

      expect(page).to have_content('Collections | All Collections')
      expect(page).to have_content('Granules | No Access to Granules')

      within '#permission-groups-table' do
        expect(page).to have_content(@group_name)
      end
    end

    it 'does not display the system groups' do
      within '#permission-groups-table' do
        expect(page).to have_no_content('Administrators')
        expect(page).to have_no_content('Administrators_2')
      end
    end

    context 'when editing the collection permission', js: true do
      before do
        click_on 'Edit'
      end

      it 'displays the permission information on the form' do
        expect(page).to have_field('Name', with: @collection_permission_name, readonly: true)

        expect(page).to have_select('Collections', selected: 'All Collections')
        expect(page).to have_select('Granules', selected: 'No Access to Granules')

        within '#search_and_order_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: @group_name)
        end
      end

      it 'does not display the system groups on the form' do
        within '#search_groups_cell' do
          expect(page).to have_no_css('li.select2-selection__choice', text: 'Administrators_2')
        end

        within '#search_and_order_groups_cell' do
          expect(page).to have_no_css('li.select2-selection__choice', text: 'Administrators')
        end
      end

      context 'when submitting the updates' do
        before do
          select('All Granules', from: 'Granules')
          select('All Registered Users', from: 'Search and Order')

          click_on 'Submit'
        end

        it 'displays the updated collection permission' do
          expect(page).to have_content(@collection_permission_name)
          expect(page).to have_content('Permission Type | Search & Order | MMT_2')

          expect(page).to have_content('Collections | All Collections')
          expect(page).to have_content('Granules | All Granules in Selected Collection Records')

          within '#permission-groups-table' do
            expect(page).to have_content(@group_name)
            expect(page).to have_content('All Registered Users')
          end
        end

        context 'when logging out and logging in as an admin user' do
          before do
            visit logout_path

            login_admin
          end

          context 'when viewing the collection permission' do
            before do
              visit permission_path(@collection_permission['concept_id'])
            end

            it 'displays the permission information' do
              expect(page).to have_content(@collection_permission_name)
              expect(page).to have_content('Permission Type | Search & Order | MMT_2')

              expect(page).to have_content('Collections | All Collections')
              expect(page).to have_content('Granules | All Granules in Selected Collection Records')

              within '#permission-groups-table' do
                expect(page).to have_content(@group_name)
                expect(page).to have_content('All Registered Users')
              end
            end

            it 'displays the system groups' do
              within '#permission-groups-table' do
                expect(page).to have_content('Administrators')
                expect(page).to have_content('Administrators_2')
              end
            end

            context 'when editing the collection permission' do
              before do
                click_on 'Edit'
              end

              it 'displays the permission information on the form' do
                expect(page).to have_field('Name', with: @collection_permission_name, readonly: true)

                expect(page).to have_select('Collections', selected: 'All Collections')
                expect(page).to have_select('Granules', selected: 'All Granules')

                within '#search_and_order_groups_cell' do
                  expect(page).to have_css('li.select2-selection__choice', text: @group_name)
                  expect(page).to have_css('li.select2-selection__choice', text: 'All Registered Users')
                end
              end

              it 'displays the system groups on the form' do
                within '#search_groups_cell' do
                  expect(page).to have_css('li.select2-selection__choice', text: 'Administrators_2')
                end

                within '#search_and_order_groups_cell' do
                  expect(page).to have_css('li.select2-selection__choice', text: 'Administrators')
                end
              end

              context 'when submitting the updates' do
                before do
                  select('No Access to Granules', from: 'Granules')

                  within '#collection_constraint_values' do
                    fill_in('Minimum Access Constraint Value', with: 5)
                    fill_in('Maximum Access Constraint Value', with: 25)
                    check('Include Undefined')
                  end

                  within '#search_and_order_groups_cell' do
                    page.find('.select2-selection__choice[title="Administrators"] > .select2-selection__choice__remove').click
                  end

                  click_on 'Submit'
                end

                it 'displays the updated collection permission information' do
                  expect(page).to have_content(@collection_permission_name)
                  expect(page).to have_content('Permission Type | Search & Order | MMT_2')

                  expect(page).to have_content('Collections | All Collections')
                  expect(page).to have_content('Collections Access Constraint Filter: Match range 5.0 to 25.0, Include Undefined')
                  expect(page).to have_content('Granules | No Access to Granules')

                  within '#permission-groups-table' do
                    expect(page).to have_content(@group_name)
                    expect(page).to have_content('All Registered Users')
                    expect(page).to have_content('Administrators')
                    expect(page).to have_content('Administrators_2')
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
