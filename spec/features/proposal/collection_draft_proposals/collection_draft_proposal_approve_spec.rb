describe 'Collection Draft Proposal Approve', js: true do
  before do
    login
  end

  context 'when viewing a proposal as an approver' do
    before do
      set_as_proposal_mode_mmt(with_draft_approver_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      mock_submit(@collection_draft_proposal)
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'retains user features' do
      expect(page).to have_content('Cancel Proposal Submission')
    end

    context 'when a create proposal is approved' do
      before do
        click_on 'Approve Proposal Submission'
      end

      context 'when clicking yes' do
        before do
          VCR.use_cassette('urs/proposal_email_fetch/proposal_approval') do
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

      context 'when clicking no' do
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
        # submit will fail in order to execute the else code in the controller.
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
end
