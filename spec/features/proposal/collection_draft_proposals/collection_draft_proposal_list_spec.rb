describe 'Viewing Unsubmitted Collection Draft Proposals', js: true do
  before do
    login
    set_as_proposal_mode_mmt
    4.times { create(:full_collection_draft_proposal) }
    create(:full_collection_draft_proposal, draft_short_name: 'An Example Proposal', version: '5', draft_entry_title: 'An Example Proposal Title')
    create(:full_collection_draft_proposal, draft_short_name: 'An Example Proposal2', version: '')
  end

  context 'while on the manage collection proposals page' do
    before do
      visit manage_collection_proposals_path
    end

    it 'has a more button' do
      expect(page).to have_link('More')
    end

    it 'displays versions correctly' do
      expect(page).to have_content('An Example Proposal_5')
      expect(page).to have_content('An Example Proposal2')
    end

    it 'displays entry titles' do
      expect(page).to have_content('An Example Proposal Title')
    end
  end

  context 'while on the index page' do
    before do
      visit collection_draft_proposals_path
    end

    it 'displays versions correctly' do
      expect(page).to have_content('An Example Proposal_5')
      expect(page).to have_content('An Example Proposal2')
    end

    it 'displays entry titles' do
      expect(page).to have_content('An Example Proposal Title')
    end
  end
end
