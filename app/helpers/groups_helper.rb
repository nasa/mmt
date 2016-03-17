module GroupsHelper
  def options_for_user_select(users)
    options_for_select(users.map{ |user| ["#{user[:name]} | #{user[:email]}", user[:uid]] })
  end
end
