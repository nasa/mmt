class User < ActiveRecord::Base
  has_many :drafts

  def self.from_urs_uid(uid)
    User.find_or_create_by(urs_uid: uid)
  end
end
