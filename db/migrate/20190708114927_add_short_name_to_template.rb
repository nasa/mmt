class AddShortNameToTemplate < ActiveRecord::Migration
  def change
    add_column :templates, :short_name, :string
  end
end
