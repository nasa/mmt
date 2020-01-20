class CreateUserInvites < ActiveRecord::Migration[4.2]
  def change
    create_table :user_invites do |t|
      t.string :manager_name
      t.string :manager_email
      t.string :user_first_name
      t.string :user_last_name
      t.string :user_email
      t.string :group_id
      t.string :group_name
      t.string :provider
      t.string :token
      t.boolean :active, default: true

      t.timestamps null: false
    end
  end
end
