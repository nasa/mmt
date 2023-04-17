# There was a possibility of a user destructively updating a Collection Permission
# when there are selected collections that they do not have access to see. We need
# to test and make sure that scenario has been prevented

describe 'Updating Collection Permissions when collections are not accessible by the user test 1', js: true do
  # this collection should be visible to all Registered users
  let(:entry_title_visible_to_all) { 'Near Real-Time SSM/I EASE-Grid Daily Global Ice Concentration and Snow Extent V002' }
  let(:entry_id_visible_to_all) { 'NISE_2' }

  # these collections should only be visible to admin users
  let(:restricted_entry_title_1) { 'MODIS/Aqua Sea Ice Extent and IST Daily L3 Global 4km EASE-Grid Day V006' }
  let(:restricted_entry_id_1) { 'MYD29E1D_6' }
  let(:restricted_entry_title_2) { 'AMSR-E/Aqua Daily L3 12.5 km Tb, Sea Ice Conc., & Snow Depth Polar Grids V003' }
  let(:restricted_entry_id_2) { 'AE_SI12_3' }
  before do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_token')

      # This token needs to be where the user does not have admin access to NSIDC_ECS provider
      @token = 'jwt_access_token'

      # grab the concept ids of these collections. some are restricted, so we need the admin token
      concept_visible_to_all = collection_concept_from_keyword('NISE_2', @token)
      restricted_concept_1 = collection_concept_from_keyword('MYD29E1D_5', @token)
      restricted_concept_2 = collection_concept_from_keyword('AE_SI12_2', @token)

      @group_name = "Test_Group_NSIDC_ECS_Restricted_Permission_61"
      @group = create_group(
        name: @group_name,
        provider_id: 'NSIDC_ECS'
      )

      wait_for_cmr

      @collection_permission_some_restricted_name = 'Testing Collection Permission with SOME restricted collections 61'

      collection_permission_some_restricted = {
        group_permissions: [{
                              group_id: @group['group_id'],
                              permissions: [ "read", "order" ]
                            }],
        catalog_item_identity: {
          "name": @collection_permission_some_restricted_name,
          "provider_id": "NSIDC_ECS",
          "collection_applicable": true,
          "granule_applicable": true,
          "collection_identifier": {
            "concept_ids": [
              restricted_concept_1,
              restricted_concept_2,
              concept_visible_to_all
            ]
          }
        }
      }

      @collection_permission_some_restricted = add_group_permissions(collection_permission_some_restricted, @token)

      wait_for_cmr

      @collection_permission_all_restricted_name = 'Testing Collection Permission with ALL restricted collections permission 61'

      collection_permission_all_restricted = {
        group_permissions: [{
          group_id: @group['group_id'],
          permissions: [ "read", "order" ]
        }],
        catalog_item_identity: {
          "name": @collection_permission_all_restricted_name,
          "provider_id": "NSIDC_ECS",
          "collection_applicable": true,
          "granule_applicable": false,
          "collection_identifier": {
            "concept_ids": [
              restricted_concept_1,
              restricted_concept_2
            ]
          }
        }
      }

      @collection_permission_all_restricted = add_group_permissions(collection_permission_all_restricted, @token)

      reindex_permitted_groups
    end
  end

  after :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      remove_group_permissions(@collection_permission_some_restricted['concept_id'], @token)
      remove_group_permissions(@collection_permission_all_restricted['concept_id'], @token)
      delete_group(concept_id: @group['group_id'])
    end

    reindex_permitted_groups
  end

  context 'when logging in as a user that has restricted access to the provider collections' do
    before do
      login(provider: 'NSIDC_ECS', providers: %w(MMT_2 NSIDC_ECS))
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    end

    context 'when updating a collection permission and the user has no access to any of the selected collections', js: true do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          visit edit_permission_path(@collection_permission_all_restricted['concept_id'])
          choose('Selected Collections')
          wait_for_jQuery(10)
        end
      end

      it 'displays the collection permission edit form with 0 of 2 selected collections' do
        expect(page).to have_field('Name', with: @collection_permission_all_restricted_name, readonly: true)

        expect(page).to have_checked_field('Collections')
        expect(page).to have_unchecked_field('Granules')

        expect(page).to have_checked_field('Selected Collections')

        # we should only see the open access collection in the Available Collections
        expect(page).to have_css('#collectionsChooser_fromList option', text: "#{entry_id_visible_to_all} | #{entry_title_visible_to_all}")

        # we should not see the restricted collections in the Available Collections
        expect(page).to have_no_css('#collectionsChooser_fromList option', text: "#{restricted_entry_id_1} | #{restricted_entry_title_1}")
        expect(page).to have_no_css('#collectionsChooser_fromList option', text: "#{restricted_entry_id_2} | #{restricted_entry_title_2}")

        # we should not see the open access collection in the Selected Collections
        expect(page).to have_no_css('#collectionsChooser_toList option', text: "#{entry_id_visible_to_all} | #{entry_title_visible_to_all}")

        # we should not see the restricted collections in the Selected Collections
        expect(page).to have_no_css('#collectionsChooser_toList option', text: "#{restricted_entry_id_1} | #{restricted_entry_title_1}")
        expect(page).to have_no_css('#collectionsChooser_toList option', text: "#{restricted_entry_id_2} | #{restricted_entry_title_2}")

        within '#search_and_order_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: @group_name)
        end
      end

      context 'when updating the collection permission with no changes' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_submit_vcr", record: :none) do
            choose('All Collections')
            click_on 'Submit'
          end
        end

        it 'successfully updates the collection permission without a validation error and redirects to the show page and displaying the collection permission information with 0 of 2 selected collections' do
          expect(page).to have_no_content('You must select at least 1 collection.')

          expect(page).to have_content('Collection Permission was successfully updated.')

          expect(page).to have_content(@collection_permission_all_restricted_name)

          # we should not see the entry ids of selected collections in the collection permission
          expect(page).to have_no_content('MYD29E1D 6')
          expect(page).to have_no_content('AE_SI12 3')
          expect(page).to have_no_content('NISE 2')

          within '#granule-constraint-summary' do
            expect(page).to have_content('This permission does not grant access to granules.')
          end

          within '#permission-groups-table' do
            expect(page).to have_content(@group_name)
          end
        end
      end
    end

    context 'when updating a collection permission and the user has access to some of the selected collections', js: true do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_some_vcr", record: :none) do
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          visit edit_permission_path(@collection_permission_some_restricted['concept_id'])
          wait_for_jQuery(10)
        end
      end

      it 'displays the collection permission with 1 of 3 selected collection' do
        expect(page).to have_field('Name', with: @collection_permission_some_restricted_name, readonly: true)

        expect(page).to have_checked_field('Selected Collections')
        expect(page).to have_checked_field('Granules')

        # we should only see the open access collection in the Available Collections
        expect(page).to have_css('#collectionsChooser_fromList option', text: "#{entry_id_visible_to_all} | #{entry_title_visible_to_all}")

        # we should not see the restricted collections in the Available Collections
        expect(page).to have_no_css('#collectionsChooser_fromList option', text: "#{restricted_entry_id_1} | #{restricted_entry_title_1}")
        expect(page).to have_no_css('#collectionsChooser_fromList option', text: "#{restricted_entry_id_2} | #{restricted_entry_title_2}")

        # we should see the open access collection in the Selected Collections
        expect(page).to have_css('#collectionsChooser_toList option', text: "#{entry_id_visible_to_all} | #{entry_title_visible_to_all}")

        # we should not see the restricted collections in the Selected Collections
        expect(page).to have_no_css('#collectionsChooser_toList option', text: "#{restricted_entry_id_1} | #{restricted_entry_title_1}")
        expect(page).to have_no_css('#collectionsChooser_toList option', text: "#{restricted_entry_id_2} | #{restricted_entry_title_2}")

        within '#search_and_order_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: @group_name)
        end
      end

      context 'when updating the collection permission with no changes' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_submit_vcr", record: :none) do
            click_on 'Submit'
          end
        end

        it 'successfully updates the collection permission and redirects to the show page and displaying the collection permission information with 1 of 3 selected collections' do
          expect(page).to have_content('Collection Permission was successfully updated.')
          expect(page).to have_content(@collection_permission_some_restricted_name)

          # entry id that we expect to see
          expect(page).to have_content('NISE 2')

          # entry ids in the collection permission we do not expect to see
          expect(page).to have_no_content('MYD29E1D 6')
          expect(page).to have_no_content('AE_SI12 3')
          within '#permission-groups-table' do
            expect(page).to have_content(@group_name)
          end
        end
      end
    end
  end
end

# we need to duplicate the test and completely separate the regular login from
# login_admin, otherwise if the admin tests run first, somehow the regular login
# gets admin access
describe 'Updating Collection Permissions as an admin user when collections are not accessible by regular users' do
  # this collection should be visible to all Registered users
  let(:entry_title_visible_to_all) { 'Near Real-Time SSM/I EASE-Grid Daily Global Ice Concentration and Snow Extent V002' }
  let(:entry_id_visible_to_all) { 'NISE_2' }

  # these collections should only be visible to admin users
  let(:restricted_entry_title_1) { 'MODIS/Aqua Sea Ice Extent and IST Daily L3 Global 4km EASE-Grid Day V005' }
  let(:restricted_entry_id_1) { 'MYD29E1D_5' }
  let(:restricted_entry_title_2) { 'AMSR-E/Aqua Daily L3 12.5 km Tb, Sea Ice Conc., & Snow Depth Polar Grids V002' }
  let(:restricted_entry_id_2) { 'AE_SI12_2' }

  before do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_admin_vcr", record: :none) do
      # This token needs to be where the user does not have admin access to NSIDC_ECS provider
      @token = 'jwt_access_token'

      # grab the concept ids of these collections. some are restricted, so we need the admin token
      concept_visible_to_all = collection_concept_from_keyword('NISE_2', @token)
      restricted_concept_1 = collection_concept_from_keyword('MYD29E1D_5', @token)
      restricted_concept_2 = collection_concept_from_keyword('AE_SI12_2', @token)

      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_token')
      @group_name = "Test_Group_NSIDC_ECS_Admin_12"
      @group = create_group(
        name: @group_name,
        provider_id: 'NSIDC_ECS'
      )


      wait_for_cmr

      @collection_permission_some_restricted_name = "Testing Collection Permission with SOME restricted collections 12"

      collection_permission_some_restricted = {
        group_permissions: [{
          group_id: @group['group_id'],
          permissions: [ "read", "order" ]
        }],
        catalog_item_identity: {
          "name": @collection_permission_some_restricted_name,
          "provider_id": "NSIDC_ECS",
          "collection_applicable": true,
          "granule_applicable": true,
          "collection_identifier": {
            "concept_ids": [
              restricted_concept_1,
              restricted_concept_2,
              concept_visible_to_all
            ]
          }
        }
      }

      @collection_permission_some_restricted = add_group_permissions(collection_permission_some_restricted, @token)

      wait_for_cmr

      @collection_permission_all_restricted_name = "Testing Collection Permission with ALL restricted collections 12"

      collection_permission_all_restricted = {
        group_permissions: [{
          group_id: @group['group_id'],
          permissions: [ "read", "order" ]
        }],
        catalog_item_identity: {
          "name": @collection_permission_all_restricted_name,
          "provider_id": "NSIDC_ECS",
          "collection_applicable": true,
          "granule_applicable": false,
          "collection_identifier": {
            "concept_ids": [
              restricted_concept_1,
              restricted_concept_2
            ]
          }
        }
      }

      @collection_permission_all_restricted = add_group_permissions(collection_permission_all_restricted, @token)

      reindex_permitted_groups
    end
  end

  after :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_admin_vcr", record: :none) do
      remove_group_permissions(@collection_permission_some_restricted['concept_id'], @token)
      remove_group_permissions(@collection_permission_all_restricted['concept_id'], @token)
      delete_group(concept_id: @group['group_id'])
    end

    reindex_permitted_groups
  end

  context 'when logging in as an admin user that has full access to the provider collections' do
    before do
      login(provider: 'NSIDC_ECS', providers: %w(MMT_2 NSIDC_ECS))
      token = 'jwt_access_token'
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(token)

    end

    context 'when viewing the edit form of the collection permission that has some restricted collections', js: true do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_admin_1_vcr", record: :none) do
          visit edit_permission_path(@collection_permission_some_restricted['concept_id'])
          wait_for_jQuery(10)
        end
      end

      it 'displays the collection permission with 3 of 3 selected collection' do
        expect(page).to have_field('Name', with: @collection_permission_some_restricted_name, readonly: true)

        expect(page).to have_checked_field('Selected Collections')
        expect(page).to have_checked_field('Granules')

        # we should see all 3 collections in the Available Collections
        expect(page).to have_css('#collectionsChooser_fromList option', text: "#{entry_id_visible_to_all} | #{entry_title_visible_to_all}")
        expect(page).to have_css('#collectionsChooser_fromList option', text: "#{restricted_entry_id_1} | #{restricted_entry_title_1}")
        expect(page).to have_css('#collectionsChooser_fromList option', text: "#{restricted_entry_id_2} | #{restricted_entry_title_2}")

        # we should see all 3 collections in the Selected Collections
        expect(page).to have_css('#collectionsChooser_toList option', text: "#{entry_id_visible_to_all} | #{entry_title_visible_to_all}")
        expect(page).to have_css('#collectionsChooser_toList option', text: "#{restricted_entry_id_1} | #{restricted_entry_title_1}")
        expect(page).to have_css('#collectionsChooser_toList option', text: "#{restricted_entry_id_2} | #{restricted_entry_title_2}")

        within '#search_and_order_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: @group_name)
        end
      end
    end

    context 'when viewing the show page of the collection permission that has some restricted collections' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_admin_submit_vcr", record: :none) do
          visit permission_path(@collection_permission_some_restricted['concept_id'])
          token = 'jwt_access_token'
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(token)

        end
      end

      it 'displays the collection permission information with 3 of 3 selected collections' do
        expect(page).to have_content(@collection_permission_some_restricted_name)

        # we should see all 3 entry ids
        expect(page).to have_content('NISE 2')
        expect(page).to have_content('MYD29E1D 5')
        expect(page).to have_content('AE_SI12 2')

        within '#permission-groups-table' do
          expect(page).to have_content(@group_name)
        end
      end
    end
  end
end
