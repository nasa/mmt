describe 'Viewing Unsubmitted Collection Draft Proposals', js: true do
  before do
    login
    set_as_proposal_mode_mmt
    4.times { create(:full_collection_draft_proposal) }
    create(:full_collection_draft_proposal, draft_short_name: 'An Example Proposal', version: '5', draft_entry_title: 'An Example Title')
    create(:full_collection_draft_proposal, draft_short_name: 'A Second Example Proposal', version: '')
  end

  context 'while on the manage collection proposals page' do
    before do
      visit manage_collection_proposals_path
    end

    it 'has a more button' do
      expect(page).to have_link('More')
    end

    it 'displays short names correctly' do
      expect(page).to have_content('An Example Proposal')
      expect(page).to have_content('A Second Example Proposal')
    end

    it 'displays entry titles' do
      expect(page).to have_content('An Example Title')
    end
  end

  context 'while on the index page' do
    before do
      visit collection_draft_proposals_path
    end

    it 'displays short names correctly' do
      expect(page).to have_content('An Example Proposal')
      expect(page).to have_content('A Second Example Proposal')
    end

    it 'displays entry titles' do
      expect(page).to have_content('An Example Title')
    end
  end
end
