# Parent class of all draft objects
class Draft < ActiveRecord::Base
  belongs_to :user

  serialize :draft, JSON

  after_create :set_native_id
  before_create :default_values

  self.inheritance_column = :draft_type

  def display_short_name
    short_name || '<Blank Short Name>'
  end

  def default_values
    self.draft ||= {}
  end

  def set_native_id
    self.native_id ||= "mmt_collection_#{id}"
    save
  end
end
