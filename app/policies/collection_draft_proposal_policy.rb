class CollectionDraftProposalPolicy < ApplicationPolicy
  def publish?
    false
  end

  def show?
    verify_mode_and_non_nasa_draft_permissions
  end

  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    verify_mode_and_non_nasa_draft_permissions
  end

  def update?
    verify_mode_and_non_nasa_draft_permissions
  end

  def destroy?
    verify_mode_and_non_nasa_draft_permissions
  end

  def submit?
    update?
  end

  def rescind?
    update?
  end

  def progress?
    show?
  end

  private

  def verify_mode_and_non_nasa_draft_permissions
    proposal_mode_enabled? &&
      (is_non_nasa_draft_user?(user: user.user, token: user.token) ||
      is_non_nasa_draft_approver?(user: user.user, token: user.token))
  end

  def proposal_mode_enabled?
    Rails.configuration.proposal_mode
  end
end
