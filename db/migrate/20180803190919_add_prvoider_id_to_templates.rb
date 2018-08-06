class AddPrvoiderIdToTemplates < ActiveRecord::Migration
  def change
    add_column :templates, :provider_id, :string
  end
end
