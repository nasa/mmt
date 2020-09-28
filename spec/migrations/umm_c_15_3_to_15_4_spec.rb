require File.join(Rails.root, 'db', 'migrate', '20200924150827_umm_c_15_3_to_15_4')

describe 'Migration tests for UMM-C v1.15.3 => 1.15.4' do
  context 'when doing the down migration for MMT' do
    before do
      @draft = create(:full_collection_draft)
      @template = create(:full_collection_template)
      CollectionDraft.find(@draft.id).draft['TilingIdentificationSystems'] = [{ 'TilingIdentificationSystemName' => 'Military Grid Reference System' }]
      CollectionTemplate.find(@template.id).draft['TilingIdentificationSystems'] = [{ 'TilingIdentificationSystemName' => 'Military Grid Reference System' }]
      UmmC153To154.new.down
    end

    after do
      CollectionDraft.delete([@draft.id])
      CollectionTemplate.delete([@template.id])
    end

    it 'removes the tiling ID systems name field' do
      expect(CollectionDraft.find(@draft.id).draft.dig('TilingIdentificationSystems', 0, 'TilingIdentificationSystemName')).to be_nil
      expect(CollectionTemplate.find(@template.id).draft.dig('TilingIdentificationSystems', 0, 'TilingIdentificationSystemName')).to be_nil
    end
  end

  context 'when doing the down migration for dMMT' do
    before do
      set_as_proposal_mode_mmt
      @draft_proposal = create(:full_collection_draft_proposal)
      CollectionDraftProposal.find(@draft_proposal.id).draft['TilingIdentificationSystems'] = [{ 'TilingIdentificationSystemName' => 'Military Grid Reference System' }]
      UmmC153To154.new.down
    end

    after do
      CollectionDraftProposal.delete([@draft_proposal.id])
    end

    it 'removes the tiling ID systems name field' do
      expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('TilingIdentificationSystems', 0, 'TilingIdentificationSystemName')).to be_nil
    end
  end
end
