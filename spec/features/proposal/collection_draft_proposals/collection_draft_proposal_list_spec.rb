describe 'Viewing Collection Draft Proposals Index Pages', reset_provider: true do
  context 'when logged in as a user' do
    before do
      real_login(method: 'urs')
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      create(:full_collection_draft_proposal, proposal_short_name: 'M Example Proposal', version: '5', proposal_entry_title: 'M Example Title', user: get_user)
      create(:full_collection_draft_proposal, proposal_short_name: 'N Example Proposal', version: '5', proposal_entry_title: 'N Example Title', user: get_user)
      create(:full_collection_draft_proposal, proposal_short_name: 'O Example Proposal', version: '5', proposal_entry_title: 'O Example Title', user: get_user)
      create(:full_collection_draft_proposal, proposal_short_name: 'P Example Proposal', version: '5', proposal_entry_title: 'P Example Title', user: get_user)
      create(:full_collection_draft_proposal, proposal_short_name: 'A Example Proposal', version: '5', proposal_entry_title: 'A Example Title', user: get_user)
      mock_urs_get_users
      mock_submit(create(:full_collection_draft_proposal, proposal_short_name: 'Z Example Proposal', version: '', proposal_entry_title: 'Z Example Title', proposal_request_type: 'delete', user: get_user))
    end

    context 'while on the index page' do
      before do
        visit collection_draft_proposals_path
      end

      it 'displays short names correctly' do
        expect(page).to have_content('A Example Proposal')
        expect(page).to have_content('Z Example Proposal')
      end

      it 'displays entry titles' do
        expect(page).to have_content('A Example Title')
      end

      it 'displays proposal status' do
        expect(page).to have_link('In Work')
        expect(page).to have_link('Submitted')
      end

      it 'displays proposal request types' do
        expect(page).to have_content('Create')
        expect(page).to have_content('Delete')
      end

      it 'displays submitters' do
        expect(page).to have_content('Test User')
        expect(page).to have_content('Pending')
      end

      context 'when sorting short name' do
        before do
          click_on 'Sort by Short Name Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals tbody tr:nth-child(1)' do
            expect(page).to have_content('A Example Title')
          end
        end

        context 'when sorting short name desc' do
          before do
            click_on 'Sort by Short Name Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody tr:nth-child(6)' do
              expect(page).to have_content('A Example Proposal')
            end
          end
        end
      end

      context 'when sorting entry title' do
        before do
          click_on 'Sort by Entry Title Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals tbody tr:nth-child(6)' do
            expect(page).to have_content('Z Example Title')
          end
        end

        context 'when sorting entry title desc' do
          before do
            click_on 'Sort by Entry Title Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody tr:nth-child(1)' do
              expect(page).to have_content('Z Example Title')
            end
          end
        end
      end

      context 'when sorting proposal status' do
        before do
          click_on 'Sort by Proposal Status Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals tbody tr:nth-child(6)' do
            expect(page).to have_content('Z Example Title')
          end
        end

        context 'when sorting proposal status desc' do
          before do
            click_on 'Sort by Proposal Status Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody tr:nth-child(1)' do
              expect(page).to have_content('Z Example Title')
            end
          end
        end
      end

      context 'when sorting request type' do
        before do
          click_on 'Sort by Request Type Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals tbody tr:nth-child(6)' do
            expect(page).to have_content('Z Example Title')
          end
        end

        context 'when sorting request type desc' do
          before do
            click_on 'Sort by Request Type Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody tr:nth-child(1)' do
              expect(page).to have_content('Z Example Title')
            end
          end
        end
      end

      context 'when sorting submitter asc' do
        before do
          click_on 'Sort by Submitter Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals tbody tr:nth-child(1)' do
            expect(page).to have_content('Z Example Title')
          end
        end

        context 'when sorting submitter desc' do
          before do
            click_on 'Sort by Submitter Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody tr:nth-child(6)' do
              expect(page).to have_content('Z Example Title')
            end
          end
        end
      end

      context 'when sorting updated at' do
        before do
          click_on 'Sort by Last Modified Asc'
        end

        it 'sorts in ascending order' do
          within '.open-draft-proposals tbody tr:nth-child(6)' do
            expect(page).to have_content('Z Example Title')
          end
        end

        context 'when sorting updated at desc' do
          before do
            click_on 'Sort by Last Modified Desc'
          end

          it 'sorts in descending order' do
            within '.open-draft-proposals tbody tr:nth-child(1)' do
              expect(page).to have_content('Z Example Title')
            end
          end
        end
      end
    end
  end

  context 'when logged in as an approver' do
    before do
      real_login(method: 'urs')
      mock_urs_get_users
      set_as_proposal_mode_mmt(with_draft_approver_acl: true)
      4.times { create(:full_collection_draft_proposal) }
      create(:full_collection_draft_proposal, proposal_short_name: 'An Example Proposal', version: '5', proposal_entry_title: 'An Example Title', user: get_user)
      mock_submit(create(:full_collection_draft_proposal, proposal_short_name: 'A Second Example Proposal', version: '', proposal_entry_title: 'A Second Example Title', proposal_request_type: 'delete', user: get_user))
    end

    context 'while on the in work index page' do
      before do
        visit in_work_index_collection_draft_proposals_path
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
