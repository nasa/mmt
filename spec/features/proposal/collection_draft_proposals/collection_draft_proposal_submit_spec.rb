describe 'Collection Draft Proposal Submit and Rescind', js: true do
  before do
    login
  end

  context 'when submitting a validated proposal' do
    before do
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    context 'when clicking the button to submit a proposal' do
      before do
        click_on 'Submit for Review'
      end

      context 'when clicking yes to submit a proposal' do
        before do
          click_on 'Yes'
        end

        it 'submits a proposal' do
          expect(page).to have_content('Collection Draft Proposal Submitted for Review Successfully')
          expect(page).to have_no_link('Temporal Information')
          expect(CollectionDraftProposal.last.proposal_status).to eq('submitted')
        end

        it 'populates the submitter_id' do
          expect(CollectionDraftProposal.last.submitter_id).to eq('testuser')
        end
      end

      context 'when clicking no to submit a proposal' do
        before do
          click_on 'No'
        end

        it 'does not navigate away when cancelling' do
          expect(page).to have_link('Temporal Information')
        end
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
        expect(page).to have_content('Collection Draft Proposal was not submitted for review successfully')
        within '#proposal-status-display' do
          expect(page).to have_content('Done')
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
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      mock_submit(@collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'has a rescind button and cannot be deleted' do
      expect(page).to have_link('Cancel Proposal Submission')
      expect(page).to have_no_link('Delete Collection Draft Proposal')
      within '#proposal-status-display' do
        expect(page).to have_content('Submitted')
      end
    end

    it 'does not have an approve button' do
      expect(page).to have_no_link('Approve Proposal Submission')
      within '#proposal-status-display' do
        expect(page).to have_content('Draft Proposal Submission:')
        expect(page).to have_content('Submitted')
      end
    end

    it 'can be rescinded' do
      click_on 'Cancel Proposal Submission'
      click_on 'Yes'
      expect(page).to have_link('Submit for Review')
      within '#proposal-status-display' do
        expect(page).to have_content('In Work')
      end
    end

    context 'when rescinding fails' do
      before do
        # After loading the page, manipulate the state of the proposal so that
        # rescind will fail in order to execute the else code.
        mock_publish(@collection_draft_proposal)
        click_on 'Cancel Proposal Submission'
        click_on 'Yes'
      end

      it 'provides the correct error message' do
        within '#proposal-status-display' do
          expect(page).to have_content('Done')
        end
        expect(page).to have_content 'Collection Draft Proposal was not canceled successfully'
      end
    end
  end

  context 'when looking at a delete metadata request' do
    before do
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal, proposal_request_type: 'delete')
      mock_submit(@collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
      @short_name = @collection_draft_proposal.draft['ShortName']
    end

    context 'when rescinding a delete metadata request' do
      before do
        click_on 'Cancel Delete Request'
        click_on 'Yes'
      end

      it 'can be rescinded and deleted' do
        expect(page).to have_content "The request to delete the collection [Short Name: #{@short_name}] has been successfully canceled."
        within '.open-drafts' do
          expect(page).to have_no_content(@short_name)
        end
      end
    end

    context 'when failing to delete a metadata request' do
      before do
        mock_publish(@collection_draft_proposal)
        click_on 'Cancel Delete Request'
        click_on 'Yes'
      end

      it 'generates the correct error message' do
        expect(page).to have_content "The request to delete the collection [Short Name: #{@short_name}] could not be successfully canceled."
        expect(page).to have_content 'Done'
      end
    end
  end

  context 'when viewing a record that has been submitted, but has no status_history' do
    before do
      # Testing bad data, do not change this to use the mock methods.
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      @collection_draft_proposal = create(:empty_collection_draft_proposal)
      @collection_draft_proposal.proposal_status = 'submitted'
      @collection_draft_proposal.save
    end

    # This test exists to verify that remove_status_history correctly
    # handles empty status_history.
    context 'when clicking the rescind button' do
      before do
        visit collection_draft_proposal_path(@collection_draft_proposal)
        click_on 'Cancel Proposal Submission'
        click_on 'Yes'
      end

      it 'can be rescinded' do
        expect(page).to have_content('Collection Draft Proposal Canceled Successfully')
      end
    end

    context 'when viewing the progress page' do
      before do
        visit progress_collection_draft_proposal_path(@collection_draft_proposal)
      end

      it 'can go to the progress page' do
        expect(page).to have_content('You may cancel this proposal to make additional changes.')
        expect(page).to have_content('No Date Provided')
        expect(page).to have_content('No User Provided')
      end
    end
  end
end
