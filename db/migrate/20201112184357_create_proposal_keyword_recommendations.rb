class CreateProposalKeywordRecommendations < ActiveRecord::Migration[5.2]
  def change
    create_table :proposal_keyword_recommendations do |t|
      t.belongs_to :draft_proposal
      t.boolean :recommendation_provided, default: false
      t.timestamps
    end
  end
end
