class MigrationForProposalPublishing < ActiveRecord::Migration
  def change
    CollectionDraftProposal.where(request_type: 'delete', provider_id: nil).delete_all
    create_proposals = CollectionDraftProposal.where(request_type: 'create')
    create_proposals.each do |proposal|
      proposal.update_column('native_id', "dmmt_collection_#{proposal['id']}")
    end
  end
end
