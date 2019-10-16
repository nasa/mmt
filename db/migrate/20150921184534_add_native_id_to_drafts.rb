class AddNativeIdToDrafts < ActiveRecord::Migration[4.2]
  def change
    add_column :drafts, :native_id, :string
  end
end
