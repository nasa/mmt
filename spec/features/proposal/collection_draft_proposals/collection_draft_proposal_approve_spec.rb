describe 'Collection Draft Proposal Approve', js: true do
  before do
    real_login(method: 'urs')
  end

  context 'when viewing a submitted proposal as an approver' do
    before do
      set_as_proposal_mode_mmt(with_draft_approver_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      mock_submit(@collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'displays the Non-NASA Draft User actions' do
      expect(page).to have_content('Cancel Proposal Submission')
    end

    it 'displays the Non-NASA Draft Approver actions' do
      expect(page).to have_content('Approve Proposal Submission')
      expect(page).to have_content('Reject Proposal Submission')
    end

    context 'when approving the proposal' do
      before do
        click_on 'Approve Proposal Submission'
      end

      context 'when clicking Yes' do
        before do
          VCR.use_cassette('urs/proposal_email_fetch/proposal_urs_ids') do
            click_on 'Yes'
          end
        end

        it 'approves a proposal' do
          expect(page).to have_content('Collection Draft Proposal Approved Successfully')
          within '#proposal-status-display' do
            expect(page).to have_content('Draft Proposal Submission')
            expect(page).to have_content('Approved')
          end
        end
      end

      context 'when clicking No' do
        before do
          click_on 'No'
        end

        it 'does not navigate away when cancelling' do
          within '#proposal-status-display' do
            expect(page).to have_content('Draft Proposal Submission')
            expect(page).to have_content('Submitted')
          end
        end
      end
    end

    context 'when the approving fails' do
      before do
        # After loading the page, manipulate the state of the proposal so that
        # approve will fail in order to execute the else code in the controller.
        mock_publish(@collection_draft_proposal)
        click_on 'Approve Proposal Submission'
        click_on 'Yes'
      end

      it 'provides an error message' do
        expect(page).to have_content('Collection Draft Proposal was not approved successfully')
        within '#proposal-status-display' do
          expect(page).to have_content('Draft Proposal Submission')
          expect(page).to have_content('Done')
        end
      end
    end
  end

  context 'when viewing a submitted proposal as a user' do
    before do
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal, user: get_user)
      mock_submit(@collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'displays the Non-NASA Draft User actions' do
      expect(page).to have_content('Cancel Proposal Submission')
    end

    it 'does not display the Non-NASA Draft Approver actions' do
      expect(page).to have_no_content('Approve Proposal Submission')
      expect(page).to have_no_content('Reject Proposal Submission')
    end
  end
end
