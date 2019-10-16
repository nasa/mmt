# Parent class of all draft objects
class Draft < ApplicationRecord
  belongs_to :user

  validates :provider_id, presence: true, if: :provider_required?

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
    record_type = draft_type.underscore.split('_').first # we should remove 'draft' from the native_id
    self.native_id ||= "mmt_#{record_type}_#{id}"
    save
  end

  def set_user_and_provider(user)
    self.user = user
    self.provider_id = user.provider_id if provider_required?
  end

  private

  def provider_required?
    # provider is required for all drafts
    true
  end
end
