class UpdateProposalKeywordRecommendations < ActiveRecord::Migration[5.2]
  def change
    add_column 'proposal_keyword_recommendations', :recommendation_request_id, :string
    add_column 'proposal_keyword_recommendations', :recommended_keywords, :text
  end
end
