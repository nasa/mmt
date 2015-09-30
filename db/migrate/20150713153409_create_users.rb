class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :urs_uid

      t.timestamps null: false
    end
  end
end
