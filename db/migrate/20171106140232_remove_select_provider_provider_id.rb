class RemoveSelectProviderProviderId < ActiveRecord::Migration
  def up
    User.where(provider_id: 'Select Provider').all.each do |user|
      user.provider_id = nil
      user.save
    end
  end
end
