class AddEchoIdAndProviderToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :echo_id, :string
    add_column :users, :provider_id, :string
    add_column :users, :available_providers, :text
  end
end
