describe 'Viewing Unsubmitted Collection Draft Proposals', js: true do
  before do
    real_login(method: 'urs')
    set_as_proposal_mode_mmt(with_draft_user_acl: true)
  end

  context 'when viewing the metadata' do
    before do
      proposal = create(:full_collection_draft_proposal, proposal_short_name: 'An Example Proposal', version: '5', proposal_entry_title: 'An Example Proposal Title', user: get_user)
      visit collection_draft_proposal_path(proposal)
    end

    it 'displays the current proposal status' do
      within '#proposal-status-display' do
        expect(page).to have_content('In Work')
      end
    end

    context 'when clicking the submit button' do
      before do
        click_on 'Submit for Review'
      end

      it 'has the correct modal text' do
        expect(page).to have_content('Are you sure you want to submit this proposal for review? Upon approval, your collection record will be published to the CMR.')
      end
    end

    it 'has a delete link' do
      expect(page).to have_link('Delete Collection Draft Proposal')
    end

    it 'does not have the metadata download option' do
      expect(page).to have_no_content('Metadata Download:')
    end

    it 'has a hidden search dropdown in proposal mode' do
      within '.quick-search' do
        expect(page).to have_css('.search-dropdown-short', :visible => false)
        expect(page).to have_css('.search-disabled-radio-buttons', :visible => false)
      end
    end


  end

  context 'when viewing incomplete metadata' do
    before do
      proposal = create(:empty_collection_draft_proposal, user: get_user)
      visit collection_draft_proposal_path(proposal)
    end

    context 'when trying to submit it' do
      before do
        click_on('Submit for Review')
      end

      it 'cannot be submitted yet' do
        expect(page).to have_content('This proposal is not ready to be submitted. Please use the progress indicators on the proposal preview page to address incomplete or invalid fields.')
      end
    end
  end

  context 'when viewing proposals in different states' do
    before do
      @proposal = create(:full_collection_draft_proposal, proposal_short_name: 'An Example Proposal', version: '5', proposal_entry_title: 'An Example Proposal Title', user: get_user)
    end

    context 'when viewing submitted proposals' do
      before do
        mock_submit(@proposal)
        visit collection_draft_proposal_path(@proposal)
      end

      it 'does not have the metadata download option' do
        expect(page).to have_no_content('Metadata Download:')
      end
    end

    context 'when viewing approved proposals' do
      before do
        mock_approve(@proposal)
        visit collection_draft_proposal_path(@proposal)
      end

      it 'does not have the metadata download option' do
        expect(page).to have_no_content('Metadata Download:')
      end
    end

    context 'when viewing rejected proposals' do
      before do
        mock_reject(@proposal)
        visit collection_draft_proposal_path(@proposal)
      end

      it 'does not have the metadata download option' do
        expect(page).to have_no_content('Metadata Download:')
      end
    end
  end
end
