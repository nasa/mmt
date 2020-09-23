class AddCollectionConceptIdToDrafts < ActiveRecord::Migration[5.2]
  def change
    add_column :drafts, :collection_concept_id, :string, null: true
  end
end
