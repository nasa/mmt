describe 'Deleting old proposals via rake task' do
  before do
    Rake::Task.define_task(:environment)
    Rake.application.rake_require 'tasks/proposals'
    set_as_proposal_mode_mmt(with_draft_approver_acl: true)
    @in_work_collection_draft_proposal = create(:full_collection_draft_proposal)
    @submitted_collection_draft_proposal = create(:full_collection_draft_proposal)
    @approved_collection_draft_proposal = create(:full_collection_draft_proposal)
    @rejected_collection_draft_proposal = create(:full_collection_draft_proposal)
    @done_collection_draft_proposal = create(:full_collection_draft_proposal)
    @not_deleted_collection_draft_proposal = create(:full_collection_draft_proposal)
    mock_submit(@submitted_collection_draft_proposal)
    mock_approve(@approved_collection_draft_proposal)
    mock_reject(@rejected_collection_draft_proposal)
    mock_publish(@done_collection_draft_proposal)

    @in_work_collection_draft_proposal.updated_at = 35.days.ago
    @in_work_collection_draft_proposal.save
    @submitted_collection_draft_proposal.updated_at = 25.days.ago
    @submitted_collection_draft_proposal.save
    @approved_collection_draft_proposal.updated_at = 25.days.ago
    @approved_collection_draft_proposal.save
    @rejected_collection_draft_proposal.updated_at = 25.days.ago
    @rejected_collection_draft_proposal.save
    @done_collection_draft_proposal.updated_at = 25.days.ago
    @done_collection_draft_proposal.save
  end

  context 'when using the default inactivity limit' do
    before do
      Rake::Task['delete_proposals:expired_proposals'].invoke
    end

    after do
      # Rake tasks can only be invoked once by default. Reenable for other test.
      Rake::Task['delete_proposals:expired_proposals'].reenable
    end

    it 'deletes one proposal' do
      expect(CollectionDraftProposal.count).to eq(5)
    end
  end

  context 'when setting the inactivity limit' do
    before do
      ENV['proposal_inactivity_limit'] = '1'
      Rake::Task['delete_proposals:expired_proposals'].invoke
    end

    after do
      ENV['proposal_inactivity_limit'] = nil
      Rake::Task['delete_proposals:expired_proposals'].reenable
    end

    it 'deletes one proposal in each state' do
      expect(CollectionDraftProposal.count).to eq(1)
    end
  end
end
