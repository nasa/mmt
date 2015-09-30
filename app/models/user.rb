class User < ActiveRecord::Base
  serialize :available_providers, JSON

  has_many :drafts

  def self.from_urs_uid(uid)
    return nil if uid.nil?
    User.find_or_create_by(urs_uid: uid)
  end

  def providers=(providers)
    self.available_providers = providers
    self.provider_id = providers.first if providers.size == 1
    save
  end
end
