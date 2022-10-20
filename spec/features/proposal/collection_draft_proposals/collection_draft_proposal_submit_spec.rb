# Running reset provider in order to verify approvers get emails when proposals are submitted
# EDL Failed Test
describe 'Collection Draft Proposal Submit and Rescind', reset_provider: true, js: true, skip:true do
  before do
    real_login(method: 'urs')
  end

  context 'when submitting a validated proposal' do
    before do
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal, user: get_user)
      visit collection_draft_proposal_path(@collection_draft_proposal)
    end

    context 'when user goes back in browser to edit a submitted proposal' do
      before do
        VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
          click_on 'Descriptive Keywords'
        end


        # remove keyword recommendations
        click_on 'Expand All'
        within '.selected-science-keywords ul' do
          find('li:nth-child(4) a.accept-recommendation').click
          find('li:nth-child(5) a.accept-recommendation').click
          find('li:nth-child(6) a.accept-recommendation').click
        end

        within '.nav-top' do
          VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
            click_on 'Done'
          end
        end

        click_on 'Submit for Review'
        click_on 'Yes'

        # for some reason this is needed twice to actually go back
        page.driver.go_back
        page.driver.go_back

        find('#science-keywords', text: 'Science Keywords').click
        click_on 'EARTH SCIENCE'
        click_on 'ATMOSPHERE'
        click_on 'AEROSOLS'
        click_on 'Add Keyword'

        within '.nav-top' do
          click_on 'Done'
        end
      end

      it 'does not allow updates to propogate' do
        expect(page).to have_content('Only proposals in an "In Work" status can be edited.')
        expect(page).to have_link('Cancel Proposal Submission')
      end
    end

    context 'when the submit proposal button is clicked' do
      before do
        click_on 'Submit for Review'
      end

      context 'when clicking yes to submit a proposal' do
        before do
          mock_urs_get_users(count: 2)
          @email_count = ActionMailer::Base.deliveries.count
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

      context 'when clicking yes to submit a proposal' do
        before do
          # Need mmt_proper to do group manipulations; will need to reset proposal mode in each of the tests
          set_as_mmt_proper
        end

        context 'when trying to send emails' do
          context 'when no acl for that provider exists' do
            before do
              set_as_proposal_mode_mmt(with_draft_user_acl: true)
              mock_urs_get_users(count: 2)
              @email_count = ActionMailer::Base.deliveries.count
              click_on 'Yes'
            end
            # In this case, the provider exists, but CMR should not have an ACL
            it 'does not send e-mails to approvers' do
              # Expect 1 email because approver emails fail here (submitter succeeds)
              expect(ActionMailer::Base.deliveries.count).to eq(@email_count + 1)
            end
          end

          context 'when no groups have the create acl' do
            before do
              VCR.use_cassette('edl', record: :new_episodes) do
                @group = create_group(name: 'Approver_Email_Fail_Test_Group', members: ['testuser'])
              end
              # This is the wrong permission with one member in the right group
              # This tests that the correct permission is being checked.
              @permission = add_permissions_to_group(@group['group_id'], 'delete', 'NON_NASA_DRAFT_APPROVER', 'MMT_2')
              set_as_proposal_mode_mmt(with_draft_user_acl: true)
              mock_urs_get_users(count: 2)
              @email_count = ActionMailer::Base.deliveries.count
              click_on 'Yes'
            end

            after do
              set_as_mmt_proper
              remove_group_permissions(@permission['concept_id'])
              VCR.use_cassette('edl', record: :new_episodes) do
                delete_group(concept_id: @group['group_id'], admin: true)
              end
            end

            it 'does not send e-mails to approvers' do
              # Expect 1 email because approver emails fail here (submitter succeeds)
              expect(ActionMailer::Base.deliveries.count).to eq(@email_count + 1)
            end
          end

          context 'when successfully sending emails' do
            before do
              VCR.use_cassette('edl', record: :new_episodes) do
                @group = create_group(name: 'Approver_Email_Success_Test_Group', members: ['testuser'])
              end
              @permission = add_permissions_to_group(@group['group_id'], 'create', 'NON_NASA_DRAFT_APPROVER', 'MMT_2')
              set_as_proposal_mode_mmt(with_draft_user_acl: true)
              mock_urs_get_users(count: 2)
              @email_count = ActionMailer::Base.deliveries.count
              click_on 'Yes'
            end

            after do
              set_as_mmt_proper
              remove_group_permissions(@permission['concept_id'])
              VCR.use_cassette('edl', record: :new_episodes) do
                delete_group(concept_id: @group['group_id'], admin: true)
              end
            end

            it 'sends emails' do
              # Expect 3 emails because of the mock call above; 1 to submitter and 2 to approvers
              expect(ActionMailer::Base.deliveries.count).to eq(@email_count + 3)
              expect(ActionMailer::Base.deliveries.last.body.parts[0].body.raw_source).to match(/has been submitted by/)
              expect(ActionMailer::Base.deliveries.last.body.parts[1].body.raw_source).to match(/has been submitted by/)
            end
          end
        end
      end

      context 'when the no button is clicked' do
        before do
          click_on 'No'
        end

        it 'does not navigate away when cancelling' do
          expect(page).to have_link('Temporal Information')
        end
      end
    end

    context 'when the collection is valid on page load, but not when the user tries to submit it' do
      before do
        @collection_draft_proposal.draft['Version'] = ''
        @collection_draft_proposal.save

        click_on 'Submit'
        click_on 'Yes'
      end

      it 'displays an error message' do
        expect(page).to have_content('This collection can not be submitted for review')
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
      @collection_draft_proposal = create(:full_collection_draft_proposal, user: get_user)
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
      @collection_draft_proposal = create(:full_collection_draft_proposal, proposal_request_type: 'delete', user: get_user)
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
      @collection_draft_proposal = create(:empty_collection_draft_proposal, user: get_user)
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
