class RemoveDraftsWithMissingProvider < ActiveRecord::Migration
  def change
    Draft.where(provider_id: nil).destroy_all
  end
end
