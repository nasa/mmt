module GroupsHelper
  def options_for_user_select(users)
    options_for_select(users.map { |user| ["#{user[:name]} | #{user[:email]}", user[:uid]] })
  end

  def group_provider(group)
    if group['provider-id'].nil? && group['concept-id'] =~ /(CMR)$/
      'CMR'
    else
      group['provider-id']
    end
  end

  def providers_for_groups_filter(provider_ids)
    provider_ids.unshift
    providers = provider_ids.map { |provider| provider[1] }
  end
end
