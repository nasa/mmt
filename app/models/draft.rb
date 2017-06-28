# Parent class of all draft objects
class Draft < ActiveRecord::Base
  belongs_to :user

  serialize :draft, JSON

  before_create :default_values

  def display_entry_title
    entry_title || '<Untitled Collection Record>'
  end

  def display_short_name
    short_name || '<Blank Short Name>'
  end

  def default_values
    self.draft ||= {}
  end

  class << self

  end
end
