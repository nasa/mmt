class TemplateAddTemplateName < ActiveRecord::Migration
  def change
    add_column :templates, :template_name, :string
  end
end
