module GroupsHelper
  def options_for_user_select(users, selected = nil)
    options_for_select(users.map { |user| ["#{user['first_name']} #{user['last_name']} | #{user['email_address']}", user['uid']] }, selected)
  end

  def check_if_system_group?(group, concept_id)
    group['provider_id'].nil? && concept_id =~ /(CMR)$/ ? true : false
  end

  def group_provider(group)
    check_if_system_group?(group, group['concept_id']) ? 'CMR' : group['provider_id']
  end

  def set_group_options(option_list, groups)
    groups.each do |group|
      concept_id = group['concept_id']
      name = group['name']
      name += ' (System Group)' if check_if_system_group?(group, concept_id)
      group_option = [name, concept_id]

      option_list << group_option
    end
  end

  def set_system_group_options
    system_group_options = []
    set_group_options(system_group_options, @system_groups)

    system_group_options.unshift(['Select an Initial Management Group', nil])
    system_group_options
  end

  def set_provider_and_system_group_options
    provider_and_system_group_options = []
    set_group_options(provider_and_system_group_options, @provider_groups)
    set_group_options(provider_and_system_group_options, @system_groups)

    provider_and_system_group_options.unshift(['Select an Initial Management Group', nil])
    provider_and_system_group_options
  end
end
