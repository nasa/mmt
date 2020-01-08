class AddSubmitterColumn < ActiveRecord::Migration
  def change
    add_column 'draft_proposals', :submitter_id, :string

    submitted_proposals = CollectionDraftProposal.where.not(proposal_status: 'in_work')
    submitted_proposals.each do |proposal|
      proposal.update_column('submitter_id', User.find(proposal.user_id).urs_uid) if proposal.submitter_id.blank?
    end
  end
end
