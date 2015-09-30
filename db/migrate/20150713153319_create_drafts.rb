class CreateDrafts < ActiveRecord::Migration
  def change
    create_table :drafts do |t|
      t.integer :user_id
      t.text :draft
      t.string :title

      t.timestamps null: false
    end
  end
end
