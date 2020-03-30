describe 'Collection Draft Proposal Reject', js: true do
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

    context 'when the rejecting the proposal' do
      before do
        click_on 'Reject Proposal Submission'
      end

      it 'displays the modal to provide rejection feedback' do
        within '#reject-submission-modal' do
          expect(page).to have_content('Please provide the reasons for rejecting this proposal submission.')
          expect(page).to have_select('proposal-rejection-reasons', with_options: ['Missing Keywords', 'Insufficient Content', 'Misspellings/Grammar', 'Invalid/Incorrect Content', 'Broken Links', 'Duplicate Metadata', 'Other'])
          expect(page).to have_field('Note')
        end
      end

      context 'when attempting to reject without entering feedback' do
        before do
          within '#reject-submission-modal' do
            click_on 'Reject'
          end
        end

        it 'displays validation errors' do
          within '#reject-submission-modal' do
            expect(page).to have_css('.eui-banner--danger', count: 2)
            expect(page).to have_content('Reason(s) are required')
            expect(page).to have_content('Note is required')
          end
        end

        context 'when then entering feedback' do
          before do
            within '#reject-submission-modal' do
              select 'Broken Links', from: 'proposal-rejection-reasons'
              fill_in 'Note', with: 'There are many reasons for rejecting this submission'

              all('label[for="rejection_note"]').first.click
            end
          end

          it 'does not display the validation errors' do
            within '#reject-submission-modal' do
              expect(page).to have_no_css('.eui-banner--danger')
            end
          end
        end
      end

      context 'when rejecting the proposal with feedback' do
        before do
          mock_urs_get_users
          @email_count = ActionMailer::Base.deliveries.count
          within '#reject-submission-modal' do
            select 'Broken Links', from: 'proposal-rejection-reasons'
            fill_in 'Note', with: 'There are many reasons for rejecting this submission'

            click_on 'Reject'
          end
        end

        it 'rejects the proposal' do
          expect(page).to have_content('Collection Draft Proposal Rejected Successfully')
          within '#proposal-status-display' do
            expect(page).to have_content('Draft Proposal Submission')
            expect(page).to have_content('Rejected')
          end
        end

        it 'sends two e-mails' do
          # Reject sends two e-mails; one to approver and one to user
          expect(ActionMailer::Base.deliveries.count).to eq(@email_count + 2)
          expect(ActionMailer::Base.deliveries.last.body.parts[0].body.raw_source).to match(/Additional feedback was provided: 'There are many reasons for rejecting this submission'/)
          expect(ActionMailer::Base.deliveries.last.body.parts[1].body.raw_source).to match(/Additional feedback was provided: 'There are many reasons for rejecting this submission'/)
        end
      end

      context 'when clicking Cancel' do
        before do
          click_on 'Cancel'
        end

        it 'does not navigate away when cancelling' do
          within '#proposal-status-display' do
            expect(page).to have_content('Draft Proposal Submission')
            expect(page).to have_content('Submitted')
          end
        end
      end
    end

    context 'when rejecting fails' do
      before do
        # After loading the page, manipulate the state of the proposal so that
        # reject will fail in order to execute the else code in the controller.
        mock_publish(@collection_draft_proposal)
        click_on 'Reject Proposal Submission'

        select 'Broken Links', from: 'proposal-rejection-reasons'
        fill_in 'Note', with: 'There are many reasons for rejecting this submission'

        click_on 'Reject'
      end

      it 'provides an error message' do
        expect(page).to have_content('Collection Draft Proposal was not rejected successfully')
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
