class AddDraftTypeToDrafts < ActiveRecord::Migration
  def change
    add_column :drafts, :draft_type, :string
  end
end
