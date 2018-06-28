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
        empty = '{"hits": 0, "took": 7, "items": []}'
        empty_response = cmr_success_response(empty)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).and_return(empty_response)

        visit permissions_path
      end

      it 'indicates there are no permissions' do
        within '#custom-permissions-table' do
          expect(page).to have_content('No permissions found.')
        end
      end
    end

    context 'when there are permissions' do
      before do
        add_associated_permissions_to_group(group_id: group1_id, name: 'Testing Collection Permission Index Regular 01', permissions: %w(read))
        add_associated_permissions_to_group(group_id: group2_id, name: 'Testing Collection Permission Index Regular 02', permissions: %w(read order))
        add_associated_permissions_to_group(group_id: group3_id, name: 'Testing Collection Permission Index Regular 03', permissions: %w(read order))

        visit permissions_path
      end

      it 'displays the table of collection permissions' do
        within '#custom-permissions-table' do
          expect(page).to have_content('Testing Collection Permission Index Regular 01')
          expect(page).to have_content('Testing Collection Permission Index Regular 02')
          expect(page).to have_content('Testing Collection Permission Index Regular 03')
        end
      end
    end
  end
end
