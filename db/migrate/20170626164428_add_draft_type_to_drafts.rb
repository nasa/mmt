class AddDraftTypeToDrafts < ActiveRecord::Migration[4.2]
  def change
    add_column :drafts, :draft_type, :string
  end
end
