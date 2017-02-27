require 'rails_helper'

describe 'Groups Associated Permissions', reset_provider: true do
  context 'when creating a new group with an associated collection permission' do
    before do
      login

      group_id = create_group['concept_id']
      add_associated_permissions_to_group(group_id, 'Test Permission', 'MMT_2')

      visit group_path(group_id)
    end

    it 'displays the associated permission' do
      expect(page).to have_content 'Associated Permissions Test Permission'
    end
  end
end
