class RemoveTitleFromDrafts < ActiveRecord::Migration
  def change
    remove_column :drafts, :title, :string
  end
end
