describe 'Proposal access in Draft MMT', reset_provider: true do
  before do
    set_as_proposal_mode_mmt
    visit manage_collection_proposals_path

    @token = 'jwt_access_token'
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(ManageMetadataController).to receive(:ensure_non_nasa_draft_permissions).and_return(true)
    allow_any_instance_of(PermissionChecking).to receive(:either_non_nasa_user_or_approver?).and_return(true)
  end

  context 'when the user has Non-NASA Draft User permissions' do
    before :all do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @non_nasa_draft_users_group = create_group(name: 'Non_NASA_Draft_Users_Group_1', members: ['chris.gokey', 'rosy.cordova'], provider_id: 'MMT_2')
        @token = 'jwt_access_token'
        #remove_group_permissions('ACL1200442598-CMR', @token)
        @non_nasa_permissions = add_permissions_to_group(@non_nasa_draft_users_group['group_id'], 'create', 'NON_NASA_DRAFT_USER', 'MMT_2', @token)
      end
    end

    after :all do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @token = 'jwt_access_token'
        remove_group_permissions(@non_nasa_permissions['concept_id'], @token)
        delete_group(concept_id: @non_nasa_draft_users_group['group_id'], admin: true)
      end
    end

    before do
      # we need to create another user in the database for others' proposals
      User.from_urs_uid('adminuser')
      real_login(method: 'urs')
      @their_proposal = create(:full_collection_draft_proposal, proposal_short_name: 'Their Example Proposal 1', version: '5', proposal_entry_title: 'Their Example Title 1', user: get_user(admin: true))
      create(:full_collection_draft_proposal, proposal_short_name: 'Their Example Proposal 2', version: '5', proposal_entry_title: 'Their Example Title 2', user: get_user(admin: true))

      @my_proposal = create(:full_collection_draft_proposal, proposal_short_name: 'My Example Proposal 1', version: '5', proposal_entry_title: 'My Example Title 1', user: get_user)
    end

    context 'when the user tries to access a proposal they are not the owner of' do
      context 'when visiting the index page' do
        before do
          visit collection_draft_proposals_path
        end

        it 'shows the correct proposals' do
          expect(page).to have_content('My Example Proposal 1')

          expect(page).to have_no_content('Their Example Proposal 1')
          expect(page).to have_no_content('Their Example Proposal 2')
        end
      end

      context 'when trying to view a proposal owned by another user' do
        before do
          visit collection_draft_proposal_path(@their_proposal)
        end

        it 'redirects to the Manage Collection Proposals page with the appropriate error message' do
          expect(page).to have_css('.eui-callout-box h3', text: 'Create Collection Proposal')
          expect(page).to have_css('.eui-callout-box h3', text: 'Collection Draft Proposals')
          expect(page).to have_content('It appears you do not have access to this Collection Draft Proposal. If you feel you should have access, please try again or contact Earthdata Support')
        end
      end

      context 'when trying to edit a proposal owned by another user' do
        before do
          visit edit_collection_draft_proposal_path(@their_proposal)
        end

        it 'redirects to the Manage Collection Proposals page with the appropriate error message' do
          expect(page).to have_css('.eui-callout-box h3', text: 'Create Collection Proposal')
          expect(page).to have_css('.eui-callout-box h3', text: 'Collection Draft Proposals')
          expect(page).to have_content('It appears you do not have access to this Collection Draft Proposal. If you feel you should have access, please try again or contact Earthdata Support')
        end
      end

      context 'when trying to view progress of a proposal owned by another user' do
        before do
          visit progress_collection_draft_proposal_path(@their_proposal)
        end

        it 'redirects to the Manage Collection Proposals page with the appropriate error message' do
          expect(page).to have_css('.eui-callout-box h3', text: 'Create Collection Proposal')
          expect(page).to have_css('.eui-callout-box h3', text: 'Collection Draft Proposals')
          expect(page).to have_content('It appears you do not have access to this Collection Draft Proposal. If you feel you should have access, please try again or contact Earthdata Support')
        end
      end

      context 'when trying to view progress of a proposal owned by another user' do
        before do
          visit submit_collection_draft_proposal_path(@their_proposal)
        end

        it 'redirects to the Manage Collection Proposals page with the appropriate error message' do
          expect(page).to have_css('.eui-callout-box h3', text: 'Create Collection Proposal')
          expect(page).to have_css('.eui-callout-box h3', text: 'Collection Draft Proposals')
          expect(page).to have_content('It appears you do not have access to this Collection Draft Proposal. If you feel you should have access, please try again or contact Earthdata Support')
        end
      end
    end

    context 'when viewing a proposal owned by the user' do
      before do
        allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(true)
        visit collection_draft_proposal_path(@my_proposal)
      end

      it 'shows the proposal' do
        expect(page).to have_content('Submit for Review')
        expect(page).to have_content('Draft Proposal Submission: In Work')
        expect(page).to have_content('Metadata Fields')
        within '#metadata-preview' do
          expect(page).to have_content('My Example Proposal 1', normalize_ws: true)
        end
      end

      context 'when trying to make an approver action without proper permissions' do
        before do
          allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(false)
          visit approve_collection_draft_proposal_path(@my_proposal)
        end

        it 'redirects to the Manage Collection Proposals page with the appropriate error message' do
          expect(page).to have_css('.eui-callout-box h3', text: 'Create Collection Proposal')
          expect(page).to have_css('.eui-callout-box h3', text: 'Collection Draft Proposals')
          expect(page).to have_content('It appears that you do not have the correct permissions or are not allowed to approve this Collection Draft Proposal. If you feel you should have access, please try again or contact Earthdata Support')
        end
      end
    end
  end
end
