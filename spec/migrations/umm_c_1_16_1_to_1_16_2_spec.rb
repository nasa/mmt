require File.join(Rails.root, 'db', 'migrate', '20210505140111_umm_c1_16_1_to_1_16_2')

describe 'Migration tests for UMM-C v1.16-1 -> 1.16.2' do
  let(:up_use_constraints) do
    {
      'Description' => 'These are some use constraints',
      'LicenseURL' => {
        'Linkage' => 'http://example.com'
      }
    }
  end

  let(:down_use_constraints) do
    {
      'Description' => {
        'Description' => 'These are some use constraints'
      },
      'LicenseUrl' => {
        'Linkage' => 'http://example.com'
      }
    }
  end

  context 'when doing the up migration for MMT' do
    before do
      @draft = create(:full_collection_draft)
      @template = create(:full_collection_template)

      @draft.draft['UseConstraints'] = {
        'Description' => {
          'Description' => 'These are some use constraints'
        },
        'LicenseUrl' => {
          'Linkage' => 'http://example.com'
        }
      }
      @template.draft['UseConstraints'] = {
        'Description' => {
          'Description' => 'These are some use constraints'
        },
        'LicenseUrl' => {
          'Linkage' => 'http://example.com'
        }
      }

      @draft.save
      @template.save
      UmmC1161To1162.new.up
    end

    after do
      CollectionDraft.delete([@draft.id])
      CollectionTemplate.delete([@template.id])
    end

    it 'modifies to the correct Use Constraints field structure' do
      expect(CollectionDraft.find(@draft.id).draft['UseConstraints']).to eq(up_use_constraints)
      expect(CollectionTemplate.find(@template.id).draft['UseConstraints']).to eq(up_use_constraints)
    end
  end

  context 'when doing the up migration for dMMT' do
    before do
      set_as_proposal_mode_mmt
      @draft_proposal = create(:full_collection_draft_proposal)

      @draft_proposal.draft['UseConstraints'] = {
        'Description' => {
          'Description' => 'These are some use constraints'
        },
        'LicenseUrl' => {
          'Linkage' => 'http://example.com'
        }
      }

      @draft_proposal.save
      UmmC1161To1162.new.up
    end

    after do
      CollectionDraftProposal.delete([@draft_proposal.id])
    end

    it 'modifies to the correct Use Constraints field structure' do
      expect(CollectionDraftProposal.find(@draft_proposal.id).draft['UseConstraints']).to eq(up_use_constraints)
    end
  end

  context 'when doing the down migration for MMT' do
    before do
      @draft = create(:full_collection_draft)
      @template = create(:full_collection_template)

      @draft.draft['UseConstraints'] = {
        'Description' => 'These are some use constraints',
        'LicenseURL' => {
          'Linkage' => 'http://example.com'
        }
      }
      @template.draft['UseConstraints'] = {
        'Description' => 'These are some use constraints',
        'LicenseURL' => {
          'Linkage' => 'http://example.com'
        }
      }

      @draft.save
      @template.save
      UmmC1161To1162.new.down
    end

    after do
      CollectionDraft.delete([@draft.id])
      CollectionTemplate.delete([@template.id])
    end

    it 'modifies to the correct Use Constraints field structure' do
      expect(CollectionDraft.find(@draft.id).draft['UseConstraints']).to eq(down_use_constraints)
      expect(CollectionTemplate.find(@template.id).draft['UseConstraints']).to eq(down_use_constraints)
    end
  end

  context 'when doing the down migration for dMMT' do
    before do
      set_as_proposal_mode_mmt
      @draft_proposal = create(:full_collection_draft_proposal)

      @draft_proposal.draft['UseConstraints'] = {
        'Description' => 'These are some use constraints',
        'LicenseURL' => {
          'Linkage' => 'http://example.com'
        }
      }

      @draft_proposal.save
      UmmC1161To1162.new.down
    end

    after do
      CollectionDraftProposal.delete([@draft_proposal.id])
    end

    it 'modifies to the correct Use Constraints field structure' do
      expect(CollectionDraftProposal.find(@draft_proposal.id).draft['UseConstraints']).to eq(down_use_constraints)
    end
  end
end
