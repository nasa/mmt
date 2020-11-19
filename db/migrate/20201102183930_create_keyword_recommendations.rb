class CreateKeywordRecommendations < ActiveRecord::Migration[5.2]
  def change
    create_table :keyword_recommendations do |t|
      t.references :recommendable, polymorphic: true, index: { name: 'keyword_recommendable_index' }
      t.boolean :recommendation_provided, default: false
      t.timestamps
    end
  end
end
