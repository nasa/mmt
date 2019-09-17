class CollectionDraftProposalPolicy < ApplicationPolicy
  
  def publish?
    false
  end

  def show?
    verify_mode_and_non_nasa_draft_user
  end

  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    verify_mode_and_non_nasa_draft_user
  end

  def update?
    verify_mode_and_non_nasa_draft_user
  end

  def destroy?
    verify_mode_and_non_nasa_draft_user
  end

  private

  def verify_mode_and_non_nasa_draft_user
    proposal_mode_enabled? && is_non_nasa_draft_user?(user: user.user, token: user.token)
  end

  def proposal_mode_enabled?
    Rails.configuration.proposal_mode
  end
end
