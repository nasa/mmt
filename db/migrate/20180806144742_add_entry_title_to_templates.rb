class AddEntryTitleToTemplates < ActiveRecord::Migration
  def change
    add_column :templates, :entry_title, :string
  end
end
