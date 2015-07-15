class RemoveEntryTitleFromDrafts < ActiveRecord::Migration
  def change
    remove_column :drafts, :entry_title, :string
  end
end
