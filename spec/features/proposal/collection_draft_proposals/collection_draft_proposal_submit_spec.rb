describe 'Collection Draft Proposal Submit', js: true do
  before do
    login
  end

  context 'when submitting a validated proposal' do
    before do
      set_as_proposal_mode_mmt(with_required_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    context 'when the proposal is submitted' do
      before do
        click_on 'Submit for Review'
      end

      it 'submits a proposal' do
        click_on 'Yes'
        expect(page).to have_content('Collection Draft Proposal Submitted Successfully')
        expect(page).to have_no_link('Temporal Information')
      end

      it 'does not navigate away when cancelling' do
        click_on 'No'
        expect(page).to have_link('Temporal Information')
      end
    end

    context 'when the submission fails' do
      before do
        # After loading the page, manipulate the state of the proposal so that
        # submit will fail in order to execute the else code in the controller.
        mock_publish(@collection_draft_proposal)
        click_on 'Submit for Review'
        click_on 'Yes'
      end

      it 'provides an error message' do
        expect(page).to have_content('Collection Draft Proposal was not submitted successfully')
        within '#proposal-status-display' do
          expect(page).to have_content('PROPOSAL STATUS:')
          expect(page).to have_content('DONE')
        end
      end
    end
  end

  context 'when submitting an incomplete proposal' do
    before do
      set_as_proposal_mode_mmt(with_required_acl: true)
      @collection_draft_proposal = create(:empty_collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
      click_on 'Submit for Review'
    end

    it 'cannot be submitted' do
      expect(page).to have_text('This proposal is not ready to be submitted. Please use the progress indicators on the proposal preview page to address incomplete or invalid fields.')
    end
  end

  context 'when viewing a submitted proposal as a user' do
    before do
      set_as_proposal_mode_mmt(with_required_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      mock_submit(@collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'has a rescind button and cannot be deleted' do
      expect(page).to have_link('Rescind Draft Submission')
      expect(page).to have_no_link('Delete Collection Draft Proposal')
      within '#proposal-status-display' do
        expect(page).to have_content('PROPOSAL STATUS:')
        expect(page).to have_content('SUBMITTED')
      end
    end

    it 'can be rescinded' do
      click_on 'Rescind Draft Submission'
      click_on 'Yes'
      expect(page).to have_link('Submit for Review')
      within '#proposal-status-display' do
        expect(page).to have_content('PROPOSAL STATUS:')
        expect(page).to have_content('IN WORK')
      end
    end

    context 'when rescinding fails' do
      before do
        # After loading the page, manipulate the state of the proposal so that
        # rescind will fail in order to execute the else code.
        mock_publish(@collection_draft_proposal)
        click_on 'Rescind Draft Submission'
        click_on 'Yes'
      end

      it 'provides the correct error message' do
        within '#proposal-status-display' do
          expect(page).to have_content('PROPOSAL STATUS:')
          expect(page).to have_content('DONE')
        end
        expect(page).to have_content 'Collection Draft Proposal was not rescinded successfully'
      end
    end
  end

  context 'when viewing a record that has been submitted, but has no status_history' do
    before do
      # Testing bad data, do not change this to use the mock methods.
      set_as_proposal_mode_mmt(with_required_acl: true)
      @collection_draft_proposal = create(:empty_collection_draft_proposal)
      @collection_draft_proposal.proposal_status = 'submitted'
      @collection_draft_proposal.save
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    # This test exists to verify that remove_status_history correctly
    # handles empty status_history.
    context 'when clicking the rescind button' do
      before do
        click_on 'Rescind Draft Submission'
        click_on 'Yes'
      end

      it 'can be rescinded' do
        expect(page).to have_content('Collection Draft Proposal Rescinded Successfully')
      end
    end

    context 'when clicking the progress badge' do
      before do
        visit progress_collection_draft_proposal_path(@collection_draft_proposal)
      end

      it 'can go to the progress page' do
        expect(page).to have_content('You may rescind this proposal to make additional changes.')
      end
    end
  end
end
