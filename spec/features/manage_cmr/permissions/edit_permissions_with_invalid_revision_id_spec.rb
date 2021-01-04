# Tests for editing collection permission with invalid revision ID (failed to get one)
# and conflicting revision ID (users trying to update the same revision)
describe 'Edit collection permissions', reset_provider: true, js: true do
  before :all do
    collection_permission_to_upload = {
      group_permissions: [ {
        permissions: [ 'read', 'order' ],
        user_type: 'registered'
      } ],
      catalog_item_identity: {
        name: 'Invalid Revision Test',
        provider_id: 'MMT_2',
        granule_applicable: false,
        collection_applicable: true,
        collection_identifier: {
          access_value: {
            min_value: 10.0,
            max_value: 10.0
          },
          entry_titles: [ ],
          concept_ids: [ ]
        }
      }
    }
    @collection_permission_for_invalid_revision = add_group_permissions(collection_permission_to_upload)
  end

  context 'with invalid revision id' do
    before do
      login
      collection_permission_response = cmr_fail_response(JSON.parse(File.read('spec/fixtures/collection_permissions/invalid_permission_response.json')))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).and_return(collection_permission_response)

      visit edit_permission_path(@collection_permission_for_invalid_revision['concept_id'])
    end

    it 'not successfully edit the collection permission' do
      expect(page).to have_content('We could not confirm the revision number of this Collection Permission.')
    end
  end

  context 'with conflicting revision id' do
    before do
      login
      collection_permission_response = cmr_success_response(File.read('spec/fixtures/collection_permissions/invalid_revision_response.json'))
      options = {'page_size'        => 25,
                 'id'               => @collection_permission_for_invalid_revision['concept_id'],
                 'include_full_acl' => true}
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).with(options, 'access_token').and_return(collection_permission_response)

      visit edit_permission_path(@collection_permission_for_invalid_revision['concept_id'])

      click_on 'Submit'
    end

    it 'not successfully submit change to collection permission' do
      expect(page).to have_content("Expected revision-id of [2] got [1] for [#{@collection_permission_for_invalid_revision['concept_id']}]")
    end
  end
end
