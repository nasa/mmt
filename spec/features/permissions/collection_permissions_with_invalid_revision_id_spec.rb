describe 'Edit collection permissions with invalid revision', reset_provider: true, js: true do
  before do
    login
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
    @collection_permission_for_invalid_revision = cmr_client.add_group_permissions(collection_permission_to_upload, 'access_token').body

    collection_permission_response = cmr_fail_response(File.read('spec/fixtures/collection_permissions/invalid_permission_response.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).and_return(collection_permission_response)

    visit edit_permission_path(@collection_permission_for_invalid_revision['concept_id'])

  end

  after do
    cmr_client.delete_permission(@collection_permission_for_invalid_revision['concept_id'], 'access_token')
  end

  it 'not successfully edit the collection permission' do
    expect(page).to have_content('We could not confirm the revision number of this Collection Permission.')
  end
end