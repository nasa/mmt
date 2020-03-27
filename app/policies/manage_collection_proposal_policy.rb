# frozen_string_literal: true

# :nodoc:
class ManageCollectionProposalPolicy < ApplicationPolicy

  def show?
    proposal_mode_enabled? && either_non_nasa_user_or_approver?
  end

  private

  def proposal_mode_enabled?
    Rails.configuration.proposal_mode
  end
end
