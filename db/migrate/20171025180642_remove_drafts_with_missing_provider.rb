class RemoveDraftsWithMissingProvider < ActiveRecord::Migration[4.2]
  def change
    Draft.where(provider_id: nil).destroy_all
  end
end
