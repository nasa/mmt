class RemoveEntryTitleFromDrafts < ActiveRecord::Migration
  def change
    remove_column :drafts, :title, :string
  end
end
