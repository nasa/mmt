# :nodoc:
class ProviderOrderPolicy < ApplicationPolicy
  def resubmit?
    user_has_provider_permission_to(user: user.user, action: 'create', target: 'PROVIDER_ORDER_RESUBMISSION', token: user.token)
  end
end
