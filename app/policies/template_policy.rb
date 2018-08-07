# :nodoc:
class TemplatePolicy < ApplicationPolicy
  def create_draft?
    user.user.provider_id == target.provider_id
  end
end
