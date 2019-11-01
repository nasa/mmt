class MandateAndUpdateRequestType < ActiveRecord::Migration
  def up
    CollectionDraftProposal.where(request_type: nil).update_all(request_type: 'create')
  end

  def down
  end
end
