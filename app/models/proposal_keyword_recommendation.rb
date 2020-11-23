class ProposalKeywordRecommendation < ApplicationRecord
  # this class/table is for tracking recommendations for Collection Draft
  # Proposals ONLY
  belongs_to :collection_draft_proposal, class_name: 'CollectionDraftProposal', foreign_key: 'draft_proposal_id', inverse_of: :keyword_recommendations, required: true

  before_create :proposal_mode_enabled?, :gkr_enabled?
  before_save :proposal_mode_enabled?, :gkr_enabled?
  # Need to bypass this before action to delete when publishing while in dev
  before_destroy :proposal_mode_enabled? unless Rails.env.development? || Rails.env.test?

  private

  def proposal_mode_enabled?
    throw(:abort) unless Rails.configuration.proposal_mode
    true
  end

  def gkr_enabled?
    throw(:abort) unless Rails.configuration.gkr_enabled
    true
  end
end
