describe 'Collection Draft Proposal destruction', js: true do
  before do
    login
    set_as_proposal_mode_mmt(with_required_acl: true)
  end

  context 'when deleting a "In Work" proposal' do
    before do
      draft = create(:full_collection_draft_proposal, draft_short_name: 'A Deletable Example')
      visit collection_draft_proposal_path(draft)
      within '.action' do
        click_on 'Delete Collection Draft Proposal'
      end
    end

    context 'when prompting the user for confirmation' do
      it 'displays a confirmation message when deleting a proposal' do
        click_on 'Yes'

        expect(page).to have_content('Collection Draft Proposal Deleted Successfully!')
        expect(page).to have_link('Create a Collection Draft Proposal')
      end

      it 'does not navigate away when cancelling a proposal deletion' do
        click_on 'No'

        expect(page).to have_no_content('Collection Draft Proposal Deleted Successfully!')
        expect(page).to have_no_link('Create a Collection Draft Proposal')
      end
    end
  end

  context 'when attempting to delete a "Submitted" proposal' do
    before do
      draft = create(:full_collection_draft_proposal, draft_short_name: 'A Deletable Example')
      proposal = CollectionDraftProposal.first
      proposal.proposal_status = 'submitted'
      proposal.save
      visit collection_draft_proposal_path(draft)
    end

    it 'does not have a delete link' do
      expect(page).to have_no_link('Delete Collection Draft Proposal')
    end
  end
end
