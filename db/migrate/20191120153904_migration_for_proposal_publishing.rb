class MigrationForProposalPublishing < ActiveRecord::Migration
  def change
    # The delete part of the migration will always work, but the update only
    # works if in proposal mode.
    CollectionDraftProposal.where(request_type: 'delete', provider_id: nil).delete_all
    create_proposals = CollectionDraftProposal.where(request_type: 'create')
    create_proposals.each do |proposal|
      proposal.update_attribute('native_id', "dmmt_collection_#{proposal['id']}")
    end
  end
end
