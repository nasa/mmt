class FixColumnName < ActiveRecord::Migration
  def change
    rename_column :templates, :title, :entry_title
  end
end
