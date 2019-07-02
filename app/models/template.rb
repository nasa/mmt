class Template < ActiveRecord::Base
  belongs_to :user
  serialize :draft, JSON
  self.inheritance_column = :template_type

  def display_title
    template_name || '<Untitled Template>'
  end

  class << self
    def create_template(draft, user, name) end
  end
end
