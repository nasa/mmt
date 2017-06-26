module UsersHelper
  def current_provider?(provider)
    current_user.provider_id == provider
  end

  def available_provider?(provider)
    current_user.available_providers.include?(provider)
  end
end
