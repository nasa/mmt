class CollectionDraftProposalPolicy < ApplicationPolicy
  def publish?
    false
  end

  def show?
    verify_proposal_mode_and_all_user_actions
  end

  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    verify_proposal_mode_and_all_user_actions
  end

  def update?
    verify_proposal_mode_and_all_user_actions
  end

  def destroy?
    verify_proposal_mode_and_all_user_actions
  end

  def submit?
    verify_proposal_mode_and_all_user_actions
  end

  def rescind?
    verify_proposal_mode_and_all_user_actions
  end

  def progress?
    verify_proposal_mode_and_all_user_actions
  end

  def approve?
    verify_mode_and_approver
  end

  def reject?
    verify_mode_and_approver
  end

  private

  def verify_proposal_mode_and_all_user_actions
    proposal_mode_enabled? && either_non_nasa_user_or_approver?
  end

  def verify_mode_and_approver
    proposal_mode_enabled? && approver?
  end

  def proposal_mode_enabled?
    Rails.configuration.proposal_mode
  end
end
