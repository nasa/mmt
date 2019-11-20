class MigrationForProposalPublishing < ActiveRecord::Migration
  def change
    CollectionDraftProposal.where(request_type: 'delete', provider_id: nil).delete_all
    create_proposals = CollectionDraftProposal.where(request_type: 'create')
    create_proposals.each do |proposal|
      # This makes the migration work for local environments without having to
      # be concerned with which mode we are in.
      proposal.update_attribute('native_id', "dmmt_collection_#{proposal['id']}")
    end
  end
end
