class RemoveTitleFromDrafts < ActiveRecord::Migration[4.2]
  def change
    remove_column :drafts, :title, :string
  end
end
