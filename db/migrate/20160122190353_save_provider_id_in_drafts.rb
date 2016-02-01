class SaveProviderIdInDrafts < ActiveRecord::Migration
  def change
    # Set current drafts providers to their user's current provider
    Draft.where(provider_id: nil).each do |draft|
      draft.provider_id = draft.user.provider_id
      draft.save
    end
  end
end
