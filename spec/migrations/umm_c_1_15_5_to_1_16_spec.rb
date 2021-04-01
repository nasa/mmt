require File.join(Rails.root, 'db', 'migrate', '20210312165348_umm_c_1_15_5_to_1_16')

describe 'Migration tests for UMM-C v1.15.5 => 1.16' do
  context 'when doing the down migration for MMT' do
    before do
      @draft = create(:full_collection_draft)
      @template = create(:full_collection_template)
      UmmC1155To116.new.down
    end

    after do
      CollectionDraft.delete([@draft.id])
      CollectionTemplate.delete([@template.id])
    end

    it 'removed the DirectDistributionInformation key' do
      expect(CollectionDraft.find(@draft.id).draft['DirectDistributionInformation']).to be_nil
      expect(CollectionTemplate.find(@template.id).draft['DirectDistributionInformation']).to be_nil
    end
  end

  context 'when doing the down migration for dMMT' do
    before do
      set_as_proposal_mode_mmt
      @draft_proposal = create(:full_collection_draft_proposal)
      UmmC1155To116.new.down
    end

    it 'removed the DirectDistributionInformation key' do
      expect(CollectionDraftProposal.find(@draft_proposal.id).draft['DirectDistributionInformation']).to be_nil
    end
  end
end
