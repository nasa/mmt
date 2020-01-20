class SaveProviderIdInDrafts < ActiveRecord::Migration[4.2]
  def change
    # Set current drafts providers to their user's current provider
    Draft.where(provider_id: nil).each do |draft|
      if draft.user_id.nil?
        draft.destroy
      else
        draft.provider_id = draft.user.provider_id
        draft.save
      end
    end
  end
end
