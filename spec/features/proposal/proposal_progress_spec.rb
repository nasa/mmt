describe 'Viewing Progress Page for Collection Metadata Proposals', js: true do
  before do
    login
    set_as_proposal_mode_mmt(with_required_acl: true)
    @collection_draft_proposal = create(:empty_collection_draft_proposal)
  end

  context 'when viewing an incomplete proposal in work' do
    before do
      visit progress_collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'displays the correct progress' do
      within '#timeline-create-submission' do
        expect(page).to have_content('In Work')
        expect(page).to have_css('div.timeline-node-active')
        expect(page).to have_css('div.timeline-faded-line-active')
        expect(page).to have_no_content('Submitted')
        expect(page).to have_no_content('By')
      end

      within '#timeline-review-submission' do
        expect(page).to have_css('div.timeline-faded-node')
        expect(page).to have_css('div.timeline-faded-line')
      end
    end

    it 'displays the correct actions' do
      within '.progress-actions' do
        expect(page).to have_content('Make additional changes or submit this proposal for approval.')
        expect(page).to have_link('Submit for Review')
        expect(page).to have_link('Edit Proposal')
      end
    end

    it 'cannot be submitted' do
      click_on 'Submit for Review'
      expect(page).to have_content('This proposal is not ready to be submitted. Please use the progress indicators on the proposal preview page to address incomplete or invalid fields.')
    end
  end

  context 'when viewing a submitted proposal' do
    before do
      mock_submit(@collection_draft_proposal)
      visit progress_collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'displays the correct progress' do
      within '#timeline-create-submission' do
        expect(page).to have_content('Submitted for Review')
        expect(page).to have_content('Submitted: 2019-10-11 01:00')
        expect(page).to have_content('By: TestUser1')
        expect(page).to have_css('div.timeline-node-active')
        expect(page).to have_css('div.timeline-faded-line-active')
      end

      within '#timeline-review-submission' do
        expect(page).to have_css('div.timeline-faded-node')
        expect(page).to have_css('div.timeline-faded-line')
      end
    end

    it 'displays the correct actions' do
      within '.progress-actions' do
        expect(page).to have_content('You may rescind this proposal to make additional changes.')
        expect(page).to have_link('Rescind this Submission')
      end
    end
  end

  context 'when viewing an approved proposal' do
    before do
      mock_approve(@collection_draft_proposal)
      visit progress_collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'displays the correct progress' do
      within '#timeline-create-submission' do
        expect(page).to have_content('Submitted for Review')
        expect(page).to have_content('Submitted: 2019-10-11 01:00')
        expect(page).to have_content('By: TestUser1')
        expect(page).to have_css('div.timeline-node')
        expect(page).to have_css('div.timeline-line')
      end

      within '#timeline-review-submission' do
        expect(page).to have_content('Approval')
        expect(page).to have_content('Approved: 2019-10-11 02:00')
        expect(page).to have_content('By: TestUser2')
        expect(page).to have_css('div.timeline-node')
        expect(page).to have_css('div.timeline-line')
      end

      within '#timeline-waiting-to-publish' do
        expect(page).to have_css('div.timeline-node-active')
        expect(page).to have_css('div.timeline-faded-line-active')
      end
    end

    it 'displays the correct actions' do
      within '.progress-actions' do
        expect(page).to have_content('No actions are possible.')
      end
    end
  end

  context 'when viewing a rejected proposal' do
    context 'when viewing a rescinded rejected proposal' do
      before do
        mock_rescind(@collection_draft_proposal)
        visit progress_collection_draft_proposal_path(@collection_draft_proposal)
      end

      it 'displays the correct progress' do
        within '#timeline-create-submission' do
          expect(page).to have_content('In Work')
          expect(page).to have_css('div.timeline-node-active')
          expect(page).to have_css('div.timeline-line-active')
          expect(page).to have_no_content('Submitted')
          expect(page).to have_no_content('By')
        end

        within '#timeline-review-submission' do
          expect(page).to have_content('Approval')
          expect(page).to have_content('Rejected: 2019-10-11 03:00')
          expect(page).to have_content('By: TestUser3')
          expect(page).to have_content('Reason: TestReason')
          expect(page).to have_css('div.timeline-node')
          expect(page).to have_css('div.timeline-faded-line')
        end
      end

      it 'displays the correct actions' do
        within '.progress-actions' do
          expect(page).to have_content('Make additional changes or submit this proposal for approval.')
          expect(page).to have_link('Submit for Review')
          expect(page).to have_link('Edit Proposal')
        end
      end
    end

    context 'when viewing a rejected proposal which has not been rescinded' do
      before do
        mock_reject(@collection_draft_proposal)
        visit progress_collection_draft_proposal_path(@collection_draft_proposal)
      end

      it 'displays the correct progress' do
        within '#timeline-create-submission' do
          expect(page).to have_content('Submitted for Review')
          expect(page).to have_css('div.timeline-node')
          expect(page).to have_css('div.timeline-line')
          expect(page).to have_content('Submitted: 2019-10-11 01:00')
          expect(page).to have_content('By: TestUser1')
        end

        within '#timeline-review-submission' do
          expect(page).to have_content('Approval')
          expect(page).to have_content('Rejected: 2019-10-11 03:00')
          expect(page).to have_content('By: TestUser3')
          expect(page).to have_content('Reason: TestReason')
          expect(page).to have_css('div.timeline-node-active')
          expect(page).to have_css('div.timeline-faded-line-active')
        end
      end

      it 'displays the correct actions' do
        within '.progress-actions' do
          expect(page).to have_content('You may rescind this proposal to make additional changes.')
          expect(page).to have_link('Rescind Rejected Proposal')
        end
      end
    end
  end

  context 'when viewing a done proposal' do
    before do
      mock_publish(@collection_draft_proposal)
      visit progress_collection_draft_proposal_path(@collection_draft_proposal)
    end

    it 'displays the correct progress' do
      within '#timeline-create-submission' do
        expect(page).to have_content('Submitted for Review')
        expect(page).to have_content('Submitted: 2019-10-11 01:00')
        expect(page).to have_content('By: TestUser1')
        expect(page).to have_css('div.timeline-node')
        expect(page).to have_css('div.timeline-line')
      end

      within '#timeline-review-submission' do
        expect(page).to have_content('Approval')
        expect(page).to have_content('Approved: 2019-10-11 02:00')
        expect(page).to have_content('By: TestUser2')
        expect(page).to have_css('div.timeline-node')
        expect(page).to have_css('div.timeline-line')
      end

      within '#timeline-waiting-to-publish' do
        expect(page).to have_css('div.timeline-node')
        expect(page).to have_css('div.timeline-line')
      end

      within '#timeline-published' do
        expect(page).to have_css('div.timeline-node-active')
        expect(page).to have_content('Published: 2019-10-11 04:00')
        expect(page).to have_content('By: TestUser4')
      end
    end

    it 'displays the correct actions' do
      within '.progress-actions' do
        expect(page).to have_content('No actions are possible.')
      end
    end
  end

  context 'when viewing a complete draft' do
    before do
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      visit progress_collection_draft_proposal_path(@collection_draft_proposal)
    end

    # Verifies that the Time is formatted correctly in the status_history
    it 'can submit a proposal' do
      click_on 'Submit for Review'
      click_on 'Yes'

      visit progress_collection_draft_proposal_path(@collection_draft_proposal)

      within '.progress-actions' do
        expect(page).to have_link('Rescind this Submission')
      end
    end
  end
end
