class KeywordRecommendation < ApplicationRecord
  # this class/table is only for tracking keyword recommendations for
  # Collection Drafts and Collection Templates
  belongs_to :recommendable, polymorphic: true, required: true

  before_create :gkr_enabled?
  before_save :gkr_enabled?
  before_destroy :gkr_enabled?

  private

  ## Feature Toggle for GKR recommendations
  def gkr_enabled?
    throw(:abort) unless Rails.configuration.gkr_enabled
    true
  end
end
