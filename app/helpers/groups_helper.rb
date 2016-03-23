module GroupsHelper
  def options_for_user_select(users)
    options_for_select(users.map{ |user| ["#{user[:name]} | #{user[:email]}", user[:uid]] })
  end

  def is_system_group?(group)
    group['provider-id'].nil? && group['concept-id'] =~ /(CMR)$/
  end
end
