class RemoveSelectProviderProviderId < ActiveRecord::Migration[4.2]
  def up
    User.all.each do |user|
      if user.available_providers && user.available_providers.include?('Select Provider')
        user.available_providers.delete('Select Provider')
        user.save
      end
      if user.provider_id == 'Select Provider'
        user.provider_id = nil
        user.save
      end
    end
  end
end
