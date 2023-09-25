class HashPolicy < ApplicationPolicy
    def show?
      user.user.provider_id == target['provider_id']
    end

    def new?
      create?
    end

    def edit?
      update?
    end

    def create?
      # make sure user has a provider id set
      !user.user.provider_id.blank?
    end

    def update?
      user.user.provider_id == target['provider_id']
    end

    def destroy?
      user.user.provider_id == target['provider_id']
    end

    # # :nodoc
    # class Scope < Scope
    #   def resolve
    #     scope.where(provider_id: user.user.provider_id)
    #   end
    # end
  end
