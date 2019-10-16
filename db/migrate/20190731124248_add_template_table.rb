class AddTemplateTable < ActiveRecord::Migration[4.2]
  def change
    create_table :templates do |t|
      t.integer :user_id
      t.text :draft
      t.string :entry_title
      t.string :provider_id
      t.string :draft_type
      t.string :template_name
      t.string :short_name
      t.string :native_id
      t.timestamps null: false
    end

    add_index :templates, [:provider_id, :template_name], unique: true
  end
end
