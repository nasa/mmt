class RemoveDraftsWithMissingProvider < ActiveRecord::Migration
  def change
    Draft.all.each do |draft|
      draft.destroy if draft.provider_id.nil?
    end
  end
end
