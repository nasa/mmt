class CreateTemplates < ActiveRecord::Migration
  def change
    create_table :templates do |t|
      t.integer :user_id
      t.text :draft
      t.string :title
      t.string :provider_id
      t.string :template_type

      t.timestamps null: false
    end
  end
end
