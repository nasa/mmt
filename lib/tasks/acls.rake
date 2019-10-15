# require 'rake'
# TODO need to make sure we are getting the right groups in a non-hardcoded way
# with MMT-1517 for refactoring the local cmr setup
# the commented out tasks will need those group concept ids or to have the groups changed
namespace :acls do
  namespace :users do
    desc 'Add a provided username to CMR'
    task :create, [:username] => :environment do |_task, args|
      print_result(cmr_client.add_users_to_local_cmr([args.username], get_acls_token), "Added #{args.username} to your local CMR (password is defaulted to `password`)")
    end
  end

  namespace :groups do
    desc 'Add a provider username to a provided group by concept_id'
    task :add_member, [:group_concept_id, :username] => :environment do |_task, args|
      print_result(cmr_client.add_group_members(args.group_concept_id, [args.username], get_acls_token))
    end

    # this should be changed to the 'MMT Admin Group'
    desc 'Add a user to the User Group' # guidMMTUser
    task :mmt_users, [:username] => :environment do |_task, args|
      print_result(cmr_client.add_group_members('AG1200000005-CMR', [args.username], get_acls_token(admin: true)), "Added #{args.username} to MMT Users")
    end

    # we don't need to add the user to this group, we should just add them to Administrators_2 below
    desc 'Add a user to the Admin Group' # guidMMTAdmin
    task :admins, [:username] => :environment do |_task, args|
      print_result(cmr_client.add_group_members('AG1200000004-CMR', [args.username, 'typical'], get_acls_token(admin: true)), "Added #{args.username} to MMT Admins")
    end

    desc 'Add a user to the Administrators_2'
    task :super_admins, [:username] => :environment do |_task, args|
      print_result(cmr_client.add_group_members('AG1200000001-CMR', [args.username, 'typical'], get_acls_token(admin: true)), "Added #{args.username} to Administrators_2")
    end

    desc 'Create a new Group'
    task :create, [:name, :description, :members, :provider] => :environment do |_task, args|
      args.with_defaults(members: [])
      args.with_defaults(provider: 'MMT_2')

      group_params = {
        'name'        => args.name,
        'description' => args.description
      }

      # Add members if any were provided
      group_params['members'] = Array.wrap(args.members) if Array.wrap(args.members).any?

      # CMR as a provider is a system group and provider_id is then ignored
      group_params['provider_id'] = args.provider unless args.provider == 'CMR'

      print_result(cmr_client.create_group(group_params, get_acls_token), "Group `#{args.name}` created.")
    end

    task :delete, [:concept_id] => :environment do |_task, args|
      print_result(cmr_client.delete_group(args.concept_id, get_acls_token), "#{args.concept_id} deleted.")
    end
  end

  namespace :testing do
    desc 'Creates a group and grants access to a provided user to update its permissions'
    task :prepare, [:username, :group_name] => :environment do |_task, args|
      args.with_defaults(group_name: "#{args.username.upcase} Testing Group")

      # Give the username the necessary permissions
      Rake::Task['acls:groups:mmt_users'].invoke(args.username)
      Rake::Task['acls:groups:admins'].invoke(args.username)

      # Create the group
      Rake::Task['acls:groups:create'].invoke(args.group_name, "Group created for #{args.username}.", args.username, 'CMR')
    end
  end

  namespace :proposal_mode do
    desc 'Creates a group and grants permission for Non-NASA Draft User'
    task :draft_user, [:username] => :environment do |_task, args|
      # Create the group
      Rake::Task['acls:groups:create'].invoke('Non-NASA Draft Users', 'Group Created for Non-NASA Draft Users', args.username, 'MMT_2')

      group_id = get_group_concept_from_name(group_name: 'Non-NASA Draft Users')

      provider_perm = {
        'group_permissions' => [{
          'group_id' => group_id,
          'permissions' => ['create']
        }],
        'provider_identity' => {
          'target' => 'NON_NASA_DRAFT_USER',
          'provider_id' => 'MMT_2'
        }
      }

      print_result(cmr_client.add_group_permissions(provider_perm, get_acls_token(admin: true)), '`Non-NASA Draft User` permissions added to the group.')
    end

    desc 'Creates a group and grans permission for Non-NASA Draft Approver'
    task :draft_approver, [:username] => :environment do |_task, args|
      # Create the group
      Rake::Task['acls:groups:create'].invoke('Non-NASA Draft Approvers', 'Group Created for Non-NASA Draft Approvers', args.username, 'MMT_2')

      group_id = get_group_concept_from_name(group_name: 'Non-NASA Draft Approvers')

      provider_perm = {
        'group_permissions' => [{
          'group_id' => group_id,
          'permissions' => ['create']
        }],
        'provider_identity' => {
          'target' => 'NON_NASA_DRAFT_APPROVER',
          'provider_id' => 'MMT_2'
        }
      }

      print_result(cmr_client.add_group_permissions(provider_perm, get_acls_token(admin: true)), '`Non-NASA Draft Approver` permissions added to the group.')
    end
  end

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end

  def get_acls_token(admin: false)
    admin ? 'access_token_admin' : 'access_token'
  end

  def print_result(cmr_response, success_message)
    if cmr_response.success?
      puts "[Success] #{success_message}"
    else
      puts "[Failure] #{cmr_response.body['errors'].first}"
    end
  end

  def get_group_concept_from_name(group_name:, token: get_acls_token)
    filter = { 'name' => group_name }
    group_response = cmr_client.get_cmr_groups(filter, token)

    raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless group_response.success?

    group_response.body.fetch('items', [{}]).first['concept_id']
  end
end
