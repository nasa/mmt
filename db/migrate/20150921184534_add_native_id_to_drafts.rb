class AddNativeIdToDrafts < ActiveRecord::Migration
  def change
    add_column :drafts, :native_id, :string
  end
end
