# frozen_string_literal: true

# :nodoc:
class CollectionDraftProposalPolicy < ApplicationPolicy
  def publish?
    # this action should not be available for proposals in Draft MMT (proposal mode)
    false
  end

  def index?
    # the controller action is only for non_nasa_users, but if an approver
    # somehow gets here, that should be allowed
    either_non_nasa_user_or_approver?
  end

  def queued_index?
    # the controller action is only for approvers
    approver?
  end

  def in_work_index?
    # the controller action is only for approvers
    approver?
  end

  def new?
    create?
  end

  def create?
    either_non_nasa_user_or_approver?
  end

  def show?
    # proposal owners and approvers are allowed this action
    approver_or_proposal_owner?
  end

  def edit?
    # proposal owners and approvers are allowed this action
    update?
  end

  def update?
    # proposal owners and approvers are allowed this action
    approver_or_proposal_owner?
  end

  def destroy?
    # proposal owners and approvers are allowed this action
    approver_or_proposal_owner?
  end

  def submit?
    # proposal owners and approvers are allowed this action
    approver_or_proposal_owner?
  end

  def rescind?
    # proposal owners and approvers are allowed this action
    approver_or_proposal_owner?
  end

  def progress?
    # proposal owners and approvers are allowed this action
    approver_or_proposal_owner?
  end

  def approve?
    # the controller action is only for approvers
    approver?
  end

  def reject?
    # the controller action is only for approvers
    approver?
  end

  private

  def approver_or_proposal_owner?
    approver? || (non_nasa_user? && user.user == target.user)
  end
end
