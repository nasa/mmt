class UpdateKeywordRecommendations < ActiveRecord::Migration[5.2]
  def change
    add_column 'keyword_recommendations', :recommendation_request_id, :string
    add_column 'keyword_recommendations', :recommended_keywords, :text
  end
end
