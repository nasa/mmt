# require 'rake'
# TODO need to make sure we are getting the right groups in a non-hardcoded way
# with MMT-1517 for refactoring the local cmr setup
# the commented out tasks will need those group concept ids or to have the groups changed
require_relative '../test_cmr/local.rb'

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

    desc 'Add a user to the MMT_2 Admin Group'
    # adds a user to MMT_2 Admin Group, which will give them access to provider groups
    # and to manage provider ACLs
    task :mmt_2_users, [:username] => :environment do |_task, args|
      group_id = get_group_concept_from_name(group_name: 'MMT_2 Admin Group')

      print_result(cmr_client.add_group_members(group_id, [args.username, 'typical'], get_acls_token), "Added #{args.username} to MMT_2 Admin Group")
    end


    desc 'Add a user to the Administrators_2'
    # adds a user to MMT_2 Admin Group, which will give them access to system groups
    # and to manage system level ACLs
    task :admins, [:username] => :environment do |_task, args|
      group_id = get_group_concept_from_name(group_name: 'Administrators_2', token: get_acls_token(admin: true))

      print_result(cmr_client.add_group_members(group_id, [args.username, 'typical'], get_acls_token(admin: true)), "Added #{args.username} to Administrators_2")
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
    desc 'Adds the user to the MMT_2 Admin group and Administrators_2 group, and grants access to a provided user to update provider and system level permissions'
    task :prepare, [:username, :group_name] => :environment do |_task, args|
      args.with_defaults(group_name: "#{args.username.upcase} Testing Group")

      # Add the username to the appropriate groups to have the necessary permissions
      Rake::Task['acls:groups:mmt_2_users'].invoke(args.username)
      Rake::Task['acls:groups:admins'].invoke(args.username)
    end
  end

  namespace :subscriptions do
    # include TestCmr::Local
    desc 'Creates a group and grants permission for managing subscriptions'
    task :full_acls, [:username] => :environment do |_task, args|
      # Create the group
      # CMR does not currently enforce ACLs on subscriptions, but including
      # typical here may make a change to that less noticable. typical is the
      # user that owns the token we pass in dev/test.
      Rake::Task['acls:groups:create'].invoke('Subscription Management', 'Group Created for Subscription Management', [args.username, 'typical'], 'MMT_2')

      cmr = TestCmr::Local.new
      cmr.clear_cache

      group_id = get_group_concept_from_name(group_name: 'Subscription Management')

      provider_perm = {
        'group_permissions' => [{
          'group_id' => group_id,
          'permissions' => ['read', 'update']
        }],
        'provider_identity' => {
          'target' => 'SUBSCRIPTION_MANAGEMENT',
          'provider_id' => 'MMT_2'
        }
      }
      cmr = TestCmr::Local.new
      cmr.clear_cache

      print_result(cmr_client.add_group_permissions(provider_perm, get_acls_token(admin: true)), '`Subscription Management` permissions added to the group.')
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

    desc 'Creates a group and grants permission for Non-NASA Draft Approver'
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

    raise Array.wrap(group_response.body['errors']).join(' /// ') unless group_response.success?

    group_response.body.fetch('items', [{}]).first['concept_id']
  end
end
