describe 'Groups Associated Permissions', reset_provider: true do
  context 'when creating a new group with an associated collection permission' do
    before do
      login

      group_id = create_group['concept_id']

      # collection permissions should show as associated permission on the group page
      # only if the group has Search or Search and Order permissions
      add_associated_permissions_to_group(group_id: group_id, name: 'Test Permission 1', permissions: [ 'read' ])
      add_associated_permissions_to_group(group_id: group_id, name: 'Test Permission 2', permissions: [ 'read', 'order' ])
      add_associated_permissions_to_group(group_id: group_id, name: 'Test Permission 3', permissions: [])
      add_associated_permissions_to_group(group_id: group_id, name: 'Test Permission 4', permissions: [ 'create', 'update', 'delete'])
      add_associated_permissions_to_group(group_id: group_id, name: 'Test Permission 5', permissions: [ 'order' ])

      visit group_path(group_id)
    end

    it 'displays the associated permissions' do
      expect(page).to have_content 'Associated Permissions'

      expect(page).to have_content 'Test Permission 1'
      expect(page).to have_content 'Test Permission 2'
      expect(page).to have_content 'Test Permission 5'
      expect(page).to have_no_content 'Test Permission 3'
      expect(page).to have_no_content 'Test Permission 4'
    end
  end
end
