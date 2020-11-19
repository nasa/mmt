
# in proper mode
# draft does not create one of these
# template does not create one of these

# in proposal mode
# cannot create recommendation by itself
# proposal can create a proposal recommendation


describe ProposalKeywordRecommendation do
  context 'when MMT is in proposal mode' do
    before do
      set_as_proposal_mode_mmt
    end

    context 'when Keyword Recommendations is turned on' do
      before do
        allow(Mmt::Application.config).to receive(:gkr_enabled).and_return(true)
      end

      it 'cannot created without a CollectionDraftProposal' do
        expect { ProposalKeywordRecommendation.create! }.to raise_error(ActiveRecord::RecordInvalid)
      end

      it 'can be created by a CollectionDraftProposal' do
        collection_draft_proposal = create(:full_collection_draft_proposal)

        collection_draft_proposal.keyword_recommendations.create

        ProposalKeywordRecommendation.all.count == 1
      end
    end


    context 'when Keyword Recommendations is turned off' do
      before do
        allow(Mmt::Application.config).to receive(:gkr_enabled).and_return(false)
      end

      it 'cannot be created' do
        collection_draft_proposal = create(:full_collection_draft_proposal)

        expect { collection_draft_proposal.keyword_recommendations.create! }.to raise_error(ActiveRecord::RecordNotSaved)

        ProposalKeywordRecommendation.all.count == 0
      end
    end
  end

  context 'when running in MMT proper' do
    context 'when there are proposals' do
      # TODO: is this really needed?
      # this scenario should not be possible, so this is a redundant safeguard test
      before do
        set_as_proposal_mode_mmt

        @collection_draft_proposal = create(:full_collection_draft_proposal)

        set_as_mmt_proper
      end

      it 'cannot be created' do
        expect { @collection_draft_proposal.keyword_recommendations.create! }.to raise_error(ActiveRecord::RecordNotSaved)

        ProposalKeywordRecommendation.all.count == 0
      end
    end

    context 'when there are no propsals' do
      before do
        set_as_mmt_proper
      end

      it 'cannot be created by CollectionDrafts and CollectionTemplates' do
        collection_draft = create(:full_collection_draft)
        collection_template = create(:full_collection_template)

        collection_draft.keyword_recommendations.create
        collection_template.keyword_recommendations.create

        ProposalKeywordRecommendation.all.count == 0
      end
    end
  end
end
