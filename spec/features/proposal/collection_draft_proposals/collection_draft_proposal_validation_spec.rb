describe 'Validating Collection Draft Proposals', js: true do
  before do
    login
    set_as_proposal_mode_mmt(with_required_acl: true)
    @collection_draft_proposal = create(:full_collection_draft_proposal)
    # Update_all bypasses validation rules, so this allows us to save invalid
    # data.
    CollectionDraftProposal.update_all(request_type: nil)
  end

  context 'when visiting the show page with an invalid request_type' do
    before do
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'does not show the proposal' do
      expect(page).to have_content('This record is in an invalid state.')
      expect(page).to have_no_css('.eui-breadcrumbs')
    end
  end

  context 'when visiting the edit page with an invalid request_type' do
    before do
      visit edit_collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'does not show the proposal' do
      expect(page).to have_content('This record is in an invalid state.')
      expect(page).to have_no_css('.eui-breadcrumbs')
    end
  end

  context 'when visiting the progress page with an invalid request_type' do
    before do
      visit progress_collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'does not show the proposal' do
      expect(page).to have_content('This record is in an invalid state.')
      expect(page).to have_no_css('.eui-breadcrumbs')
    end
  end
end
