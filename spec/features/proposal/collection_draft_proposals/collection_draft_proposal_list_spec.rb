describe 'Viewing Collection Draft Proposals Index Pages', js: true do
  context 'when logged in as a user' do
    before do
      login
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      4.times { create(:full_collection_draft_proposal) }
      create(:full_collection_draft_proposal, draft_short_name: 'An Example Proposal', version: '5', draft_entry_title: 'An Example Title')
      mock_submit(create(:full_collection_draft_proposal, draft_short_name: 'A Second Example Proposal', version: '', draft_entry_title: 'A Second Example Title', draft_request_type: 'delete'))
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

      it 'displays proposal status' do
        expect(page).to have_link('In Work')
      end

      it 'displays proposal request types' do
        expect(page).to have_content('Create')
      end

      context 'when sorting short name' do
        before do
          click_on 'Sort by Short Name Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals' do
            expect(page).to have_content('An Example Proposal')
          end
        end

        context 'when sorting short name desc' do
          before do
            click_on 'Sort by Short Name Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody' do
              expect(page).to have_content('A Second Example Proposal')
            end
          end
        end
      end

      context 'when sorting entry title' do
        before do
          click_on 'Sort by Entry Title Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals' do
            expect(page).to have_content('An Example Proposal')
          end
        end

        context 'when sorting entry title desc' do
          before do
            click_on 'Sort by Entry Title Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody' do
              expect(page).to have_content('A Second Example Proposal')
            end
          end
        end
      end

      context 'when sorting proposal status' do
        before do
          click_on 'Sort by Proposal Status Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals' do
            expect(page).to have_content('An Example Proposal')
          end
        end

        context 'when sorting proposal status desc' do
          before do
            click_on 'Sort by Proposal Status Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody' do
              expect(page).to have_content('A Second Example Proposal')
            end
          end
        end
      end

      context 'when sorting request type' do
        before do
          click_on 'Sort by Request Type Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals' do
            expect(page).to have_content('An Example Proposal')
          end
        end

        context 'when sorting request type desc' do
          before do
            click_on 'Sort by Request Type Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody' do
              expect(page).to have_content('A Second Example Proposal')
            end
          end
        end
      end

      context 'when sorting updated at' do
        before do
          click_on 'Sort by Last Modified Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals' do
            expect(page).to have_content('An Example Proposal')
          end
        end

        context 'when sorting updated at desc' do
          before do
            click_on 'Sort by Last Modified Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody' do
              expect(page).to have_content('A Second Example Proposal')
            end
          end
        end
      end
    end
  end

  context 'when logged in as an approver' do
    before do
      login
      set_as_proposal_mode_mmt(with_draft_approver_acl: true)
      4.times { create(:full_collection_draft_proposal) }
      create(:full_collection_draft_proposal, draft_short_name: 'An Example Proposal', version: '5', draft_entry_title: 'An Example Title')
      mock_submit(create(:full_collection_draft_proposal, draft_short_name: 'A Second Example Proposal', version: '', draft_entry_title: 'A Second Example Title', draft_request_type: 'delete'))
    end

    context 'while on the upcoming index page' do
      before do
        visit upcoming_index_collection_draft_proposals_path
      end

      it 'does not have any proposals in states other than "in_work"' do
        expect(page).to have_link('In Work')
        expect(page).to have_no_link('Submitted')
      end
    end

    context 'when viewing the queued index page' do
      before do
        visit queued_index_collection_draft_proposals_path
      end

      it 'does not have any proposals in "in_work"' do
        expect(page).to have_no_link('In Work')
        expect(page).to have_link('Submitted')
      end
    end
  end
end
