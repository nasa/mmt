class CreateDrafts < ActiveRecord::Migration[4.2]
  def change
    create_table :drafts do |t|
      t.integer :user_id
      t.text :draft
      t.string :title

      t.timestamps null: false
    end
  end
end
