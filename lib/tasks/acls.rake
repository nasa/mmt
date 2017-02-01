# require 'rake'

namespace :acls do
  namespace :users do
    desc 'Add a provided username to CMR'
    task :create, [:username] => :environment do |_task, args|
      puts "Adding #{args.username} to your local CMR (password is defaulted to `password`)"
      print_result(cmr_client.add_users_to_local_cmr([args.username], get_token))
    end
  end

  namespace :groups do
    desc 'Add a provider username to a provided group by concept_id'
    task :add_member, [:group_concept_id, :username] => :environment do |_task, args|
      print_result(cmr_client.add_group_members(args.group_concept_id, [args.username], get_token))
    end

    desc 'Add a user to the User Group'
    task :mmt_users, [:username] => :environment do |_task, args|
      print_result(cmr_client.add_group_members('AG1200000005-CMR', [args.username], get_token(admin: true)), "Added #{args.username} to MMT Users")
    end

    desc 'Add a user to the Admin Group'
    task :admins, [:username] => :environment do |_task, args|
      print_result(cmr_client.add_group_members('AG1200000004-CMR', [args.username, 'typical'], get_token(admin: true)), "Added #{args.username} to MMT Admins")
    end

    desc 'Add a user to the Administrators_2'
    task :super_admins, [:username] => :environment do |_task, args|
      print_result(cmr_client.add_group_members('AG1200000001-CMR', [args.username, 'typical'], get_token(admin: true)), "Added #{args.username} to Administrators_2")
    end

    task :create, [:name, :description, :members, :provider] => :environment do |_task, args|
      args.with_defaults(members: [])
      args.with_defaults(provider: 'MMT_2')

      group_params = {
        'name'        => args.name,
        'description' => args.description,
        'members'     => [args.members]
      }

      group_params['provider_id'] = args.provider unless args.provider == 'CMR'

      print_result(cmr_client.create_group(group_params, get_token), "Group `#{args.name}` created.")
    end

    task :delete, [:concept_id] => :environment do |_task, args|
      print_result(cmr_client.delete_group(args.concept_id, get_token), "#{args.concept_id} deleted.")
    end
  end

  namespace :testing do
    desc 'Creates a group and grants access to a provided user to update its permissions'
    task :prepare, [:username, :group_name] => :environment do |_task, args|
      args.with_defaults(group_name: "#{args.username.upcase} Testing Group")

      Rake::Task['acls:groups:create'].invoke(args.group_name, "Group created for #{args.username}.", args.username, 'CMR')
      Rake::Task['acls:groups:mmt_users'].invoke(args.username)
      Rake::Task['acls:groups:admins'].invoke(args.username)
    end
  end

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end

  def get_token(admin: false)
    admin ? 'access_token_admin' : 'access_token'
  end

  def print_result(cmr_response, success_message)
    if cmr_response.success?
      puts "[Success] #{success_message}"
    else
      puts "[Failure] #{cmr_response.body['errors'].first}"
    end
  end
end
