class AddRequiredToProposalStatus < ActiveRecord::Migration
  def up
    CollectionDraftProposal.where(proposal_status: nil).update_all(proposal_status: 'in_work')
    change_column 'draft_proposals', :proposal_status, :string, null: false
  end

  def down
    change_column 'draft_proposals', :proposal_status, :string, null: true
  end
end
