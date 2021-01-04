describe 'Using rake tasks to add a user to groups for local group and acl manual testing and development', reset_provider: true do
  before do
    Rake::Task.define_task(:environment)
    Rake.application.rake_require 'tasks/acls'

    @provider_group_id = get_group_concept_from_name(group_name: 'MMT_2 Admin Group')
    @sys_group_id = get_group_concept_from_name(group_name: 'Administrators_2', token: 'access_token_admin')
  end
  context 'when using acls:groups tasks' do
    # acls:testing:prepare calls the following two tasks
    # we are not adding a separate test for that task, because it uses both those
    # tasks only, and because the testing of adding and removing of group
    # members runs into indexing timing issues with local cmr within these tests.
    context 'when using acls:groups:mmt_2_users' do
      before do
        Rake::Task['acls:groups:mmt_2_users'].invoke('tasktestuser')

        wait_for_cmr
        reindex_permitted_groups
        wait_for_cmr
        clear_cache
      end

      it 'adds the appropriate users to the MMT_2 Admin Group' do
        group_response = cmr_client.get_group(@provider_group_id, 'access_token_admin')
        members_response = cmr_client.get_group_members(@provider_group_id, 'access_token_admin')
        wait_for_cmr

        expect(group_response.body['num_members']).to eq(3)
        expect(members_response.body).to eq(%w[typical testuser tasktestuser])
      end
    end

    context 'when using acls:groups:admins' do
      before do
        Rake::Task['acls:groups:admins'].invoke('adminstasktestuser')

        wait_for_cmr
        reindex_permitted_groups
        wait_for_cmr
        clear_cache
      end

      after do
        # need to remove users added to Admin groups or ACLs are not set
        # properly for other tests
        remove_members_response = cmr_client.remove_group_members(@sys_group_id, %w[adminstasktestuser typical], 'access_token_admin')
        wait_for_cmr
        reindex_permitted_groups
        wait_for_cmr
        clear_cache
        puts "removed members from admin group? #{remove_members_response.body.inspect}"
      end

      it 'adds the appropriate users to the Administrators_2 group' do
        sys_group_response = cmr_client.get_group(@sys_group_id, 'access_token_admin')
        sys_members_response = cmr_client.get_group_members(@sys_group_id, 'access_token_admin')
        wait_for_cmr

        expect(sys_group_response.body['num_members']).to eq(4)
        expect(sys_members_response.body).to eq(%w[admin adminuser adminstasktestuser typical])
      end
    end
  end
end
