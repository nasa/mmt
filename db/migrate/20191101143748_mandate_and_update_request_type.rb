class MandateAndUpdateRequestType < ActiveRecord::Migration
  def up
    CollectionDraftProposal.where(request_type: nil).update_all(request_type: 'create')
    change_column 'draft_proposals', :request_type, :string, null: false
  end

  def down
    change_column 'draft_proposals', :request_type, :string, null: true
  end
end
