describe 'Using rake tasks to add a user to groups for local group and acl manual testing and development', reset_provider: true do
  context 'when using acls:groups tasks' do
    context 'when using acls:groups:mmt_2_users' do
      before do
        Rake::Task.define_task(:environment)
        Rake.application.rake_require 'tasks/acls'
        Rake::Task['acls:groups:mmt_2_users'].invoke('tasktestuser')

        wait_for_cmr
      end

      it 'adds the appropriate users to the MMT_2 Admin Group' do
        group_id = get_group_concept_from_name(group_name: 'MMT_2 Admin Group')
        group_response = cmr_client.get_group(group_id, 'access_token_admin')
        members_response = cmr_client.get_group_members(group_id, 'access_token_admin')
        wait_for_cmr

        expect(group_response.body['num_members']).to eq(3)
        expect(members_response.body).to eq(%w[typical testuser tasktestuser])
      end
    end

    context 'when using acls:groups:admins' do
      before do
        Rake::Task.define_task(:environment)
        Rake.application.rake_require 'tasks/acls'
        Rake::Task['acls:groups:admins'].invoke('tasktestuser')

        wait_for_cmr
      end

      it 'adds the appropriate users to the Administrators_2 group' do
        sys_group_id = get_group_concept_from_name(group_name: 'Administrators_2')
        sys_group_response = cmr_client.get_group(sys_group_id, 'access_token_admin')
        sys_members_response = cmr_client.get_group_members(sys_group_id, 'access_token_admin')
        wait_for_cmr

        expect(sys_group_response.body['num_members']).to eq(4)
        expect(sys_members_response.body).to eq(%w[admin adminuser tasktestuser typical])
      end
    end
  end

  context 'when using acls:testing:prepare' do
    before do
      Rake::Task.define_task(:environment)
      Rake.application.rake_require 'tasks/acls'
      Rake::Task['acls:testing:prepare'].invoke('tasktestuser')

      wait_for_cmr
    end

    it 'adds the appropriate users to the groups' do
      group_id = get_group_concept_from_name(group_name: 'MMT_2 Admin Group')
      group_response = cmr_client.get_group(group_id, 'access_token_admin')
      members_response = cmr_client.get_group_members(group_id, 'access_token_admin')
      wait_for_cmr

      expect(group_response.body['num_members']).to eq(3)
      expect(members_response.body).to eq(%w[typical testuser tasktestuser])

      sys_group_id = get_group_concept_from_name(group_name: 'Administrators_2')
      sys_group_response = cmr_client.get_group(sys_group_id, 'access_token_admin')
      sys_members_response = cmr_client.get_group_members(sys_group_id, 'access_token_admin')
      wait_for_cmr

      expect(sys_group_response.body['num_members']).to eq(4)
      expect(sys_members_response.body).to eq(%w[admin adminuser tasktestuser typical])
    end
  end
end
