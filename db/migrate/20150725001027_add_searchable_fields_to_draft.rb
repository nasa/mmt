class AddSearchableFieldsToDraft < ActiveRecord::Migration[4.2]
  def change
    add_column :drafts, :entry_id, :string
    add_column :drafts, :entry_title, :string
    add_column :drafts, :provider_id, :string
  end
end
