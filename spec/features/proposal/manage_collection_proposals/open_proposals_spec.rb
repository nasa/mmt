describe 'Proposals listed on the Manage Collection Proposals page', js: true do
  draft_proposal_display_max_count = 5 # should agree with @draft_proposal_display_max_count found in manage_collection_proposals_controller

  context 'when viewing the manage proposals page as a user' do
    before do
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      login
    end

    context 'when no proposals exist' do
      before do
        visit manage_collection_proposals_path
      end

      it 'no drafts are displayed' do
        expect(page).to have_content('Collection Draft Proposals')

        expect(page).to have_content('There are no draft proposals to display.')
      end
    end

    context 'when there are proposals' do
      before do
        4.times { create(:full_collection_draft_proposal) }
        create(:full_collection_draft_proposal, draft_short_name: 'An Example Proposal', version: '5', draft_entry_title: 'An Example Title')
        create(:full_collection_draft_proposal, draft_short_name: 'An Second Example Proposal', version: '')

        visit manage_collection_proposals_path
      end

      it 'has a more button' do
        expect(page).to have_link('More')
      end

      it 'displays short names correctly' do
        expect(page).to have_content('An Example Proposal')
        expect(page).to have_content('An Second Example Proposal')
      end

      it 'displays states and types' do
        within '.all-proposals' do
          expect(page).to have_content('In Work')
          expect(page).to have_content('New Collection Request')
        end
      end

      context 'when visiting the index page' do
        before do
          visit collection_draft_proposals_path
        end

        it 'displays short names correctly' do
          expect(page).to have_content('An Example Proposal')
          expect(page).to have_content('An Second Example Proposal')
        end

        it 'displays entry titles' do
          expect(page).to have_content('An Example Title')
        end
      end
    end
  end

  context 'when viewing the manage collection proposals page as an approver' do
    before do
      set_as_proposal_mode_mmt(with_draft_approver_acl: true)
      login
    end

    context 'when no proposals exist' do
      before do
        visit manage_collection_proposals_path
      end

      it 'no drafts are displayed' do
        expect(page).to have_content('In Work Proposals')
        expect(page).to have_content('Queued Proposals')

        within '.in-work-proposals' do
          expect(page).to have_content('There are no draft proposals to display.')
        end
        within '.queued-proposals' do
          expect(page).to have_content('There are no draft proposals to display.')
        end
      end
    end

    context 'when there are proposals in work' do
      before do
        4.times { create(:full_collection_draft_proposal) }
        create(:full_collection_draft_proposal, draft_short_name: 'An Example Proposal', version: '5', draft_entry_title: 'An Example Title')
        create(:full_collection_draft_proposal, draft_short_name: 'An Second Example Proposal', version: '')

        visit manage_collection_proposals_path
      end

      it 'has a more button' do
        within '.in-work-proposals' do
          expect(page).to have_link('More')
        end
      end

      it 'displays short names correctly' do
        expect(page).to have_content('An Example Proposal')
        expect(page).to have_content('An Second Example Proposal')
      end

      it 'does not have any queued proposals' do
        within '.queued-proposals' do
          expect(page).to have_content('There are no draft proposals to display.')
        end
      end
    end

    context 'when there are proposals in queue' do
      before do
        2.times { mock_submit(create(:full_collection_draft_proposal)) }
        mock_submit(create(:full_collection_draft_proposal, draft_short_name: 'An Example Proposal', version: '5', draft_entry_title: 'An Example Title'))
        mock_reject(create(:full_collection_draft_proposal, draft_short_name: 'An Second Example Proposal', version: ''))
        mock_approve(create(:full_collection_draft_proposal, draft_short_name: 'A Third Example Proposal', version: ''))
        mock_publish(create(:full_collection_draft_proposal, draft_short_name: 'A Fourth Example Proposal', version: '', draft_request_type: 'delete'))

        visit manage_collection_proposals_path
      end

      it 'has a more button' do
        within '.queued-proposals' do
          expect(page).to have_link('More')
        end
      end

      it 'does not have any in work proposals' do
        within '.in-work-proposals' do
          expect(page).to have_content('There are no draft proposals to display.')
        end
      end

      it 'displays states correctly' do
        within '.queued-proposals' do
          expect(page).to have_content('Submitted')
          expect(page).to have_content('Approved')
          expect(page).to have_content('Rejected')
          expect(page).to have_content('Done')
        end
      end

      it 'displays request types correctly' do
        within '.queued-proposals' do
          expect(page).to have_content('New Collection Request')
          expect(page).to have_content('Delete Collection Request')
        end
      end
    end
  end
end
