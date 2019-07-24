class Template < ActiveRecord::Base
  belongs_to :user
  serialize :draft, JSON
  self.inheritance_column = :template_type

  def display_entry_title
    template_name || '<Untitled Template>'
  end

  def display_short_name
    short_name || '<Blank Short Name>'
  end
end
