# :nodoc:
class ProviderOrderPolicy < ProviderPolicy
  def resubmit?
    user_has_permission_to('create', 'PROVIDER_ORDER_RESUBMISSION')
  end
end
