class MigrationForProposalPublishing < ActiveRecord::Migration[4.2]
  def change
    CollectionDraftProposal.where(request_type: 'delete', provider_id: nil).delete_all
    create_proposals = CollectionDraftProposal.where(request_type: 'create')
    create_proposals.each do |proposal|
      proposal.update_column('native_id', "dmmt_collection_#{proposal['id']}")
    end
  end
end
