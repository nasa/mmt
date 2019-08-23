class CollectionDraftProposalPolicy < ApplicationPolicy

  attr_reader :user_context

  def initialize(user_context, object)
    @user_context = user_context
  end

  def publish?
    false
  end

  def show?
    verify_mode_and_logged_in?
  end

  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    verify_mode_and_logged_in?
  end

  def update?
    verify_mode_and_logged_in?
  end

  def destroy?
    verify_mode_and_logged_in?
  end

  def verify_mode_and_logged_in?
    proposal_mode_enabled? && !@user_context.user['urs_uid'].blank?
  end

  def proposal_mode_enabled?
    Rails.configuration.proposal_mode
  end
end
