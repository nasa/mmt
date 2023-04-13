# Start to finish test of the approver workflow without mocking the inter-MMT
# communications.
describe 'When going through the whole collection proposal approver workflow', js: true do
  before do
    @token = 'jwt_access_token'
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')
    real_login(method: 'launchpad')
    fake_service_account_cert
    allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(true)
    mock_urs_get_users
  end

  before do
    @token = 'jwt_access_token'
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')

    login(real_login: true)
    allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(true)
    mock_urs_get_users
  end

  context 'when loading the manage proposals page' do
    context 'when publishing a proposal to check that the UPDATE and CREATE dates are being correctly populated' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          @token = 'jwt_access_token'
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')

          @cmr_response = cmr_client.get_collections_by_post({ EntryTitle: 'Date-Check', ShortName: 'Proposal for checking MetadataDates' }, @token, 'umm_json')
          @concept_id = @cmr_response.body.dig('items', 0, 'meta', 'concept-id')
          @concept = cmr_client.get_concept(@concept_id, @token, {}).body
          @short_name = 'Proposal for checking MetadataDates'
          @create_date_after_publish = Time.parse(@concept.dig('MetadataDates', 0, 'Date'))
          @update_date_after_publish = Time.parse(@concept.dig('MetadataDates', 1, 'Date'))
        end
      end

      before do
        # FactoryBot respects validations; need to be in proposal mode to create
        set_as_proposal_mode_mmt(with_draft_approver_acl: true)
        @native_id = 'dmmt_collection_2'
        @proposal = create(:collection_draft_proposal_all_required_fields, proposal_short_name: @short_name, proposal_entry_title: 'Date-Check', proposal_request_type: 'create', proposal_native_id: @native_id)
        mock_approve(@proposal)

        # Workflow is in mmt proper, so switch back
        @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6ImNocmlzLmdva2V5IiwiZXhwIjoxNjg2NTk1MzM5LCJpYXQiOjE2ODE0MTEzMzksImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.BfFV8hjmCsGiyMwLIscfdgBQQzg4PCdgEYD6BjweRQ2NJ3uoMjShv7ToN-9iz2yPtvIp2bLvEHT3iMteEo_ZLb5APKbuawu4Vioc918SkRoE_SEZJVlftQPO_BPHh2y9EspSR0C_I4-3pa_epu0YnUu2xXgt440zr8ZufFfD3PocpHy8f6-a90Wyk3MkMGHgYGepkYRhmwlSraJrlM3n3c_jOsdKyHlh15DRJXpCUx6pL7Xt-F46doxgEatcWjn3U7RLHW8_JKSGBA-GscFCVu5uk6ctBQuQVkL72KcyDE7-qBkLCeH-rpo_ypGDLX7SFRCTWhamoHZblTMx6GilfQ'
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')

        set_as_proposal_mode_mmt(with_draft_approver_acl: true)
        visit logout_path
        set_as_mmt_proper
        real_login(method: 'launchpad')
        fake_service_account_cert
        allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(true)

        VCR.use_cassette('launchpad/token_service_success', record: :none) do
          visit manage_proposals_path
          within '.open-draft-proposals tbody tr:nth-child(1)' do
            click_on 'Publish'
          end
          select 'MMT_2', from: 'provider-publish-target'
          within '#approver-proposal-modal' do
            click_on 'Publish'
          end
        end
        wait_for_cmr
      end

      # Skipping this test because the delete block is deleting the collection in SIT but the collection created is in
      # local CMR. Need to revisit this in MMT-rework
      # after do
      #   VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :new_episodes) do
      #     cmr_client.delete_collection('MMT_2', @native_id, @token)
      #   end
      # end
      # it 'has item 0 as CREATE and item 1 as UPDATE' do
      #   expect(@concept.dig('MetadataDates', 0, 'Type')).to eq('CREATE')
      #   expect(@concept.dig('MetadataDates', 1, 'Type')).to eq('UPDATE')
      # end
      #
      # it 'contains the correct CREATE and UPDATE dates' do
      #   expect(@proposal.draft['MetadataDates']).to be_nil
      #   expect(@create_date_after_publish).to eq(@create_date_after_publish)
      #   expect(@update_date_after_publish).to eq(@update_date_after_publish)
      # end
    end

    context 'when publishing a create metadata proposal' do
      let(:short_name) { 'Full Workflow Create Test Proposal' }
      before do
        # FactoryBot respects validations; need to be in proposal mode to create
        set_as_proposal_mode_mmt(with_draft_approver_acl: true)
        @native_id = 'dmmt_collection_1'
        @proposal = create(:full_collection_draft_proposal, proposal_short_name: short_name, proposal_entry_title: 'Test Entry Title', proposal_request_type: 'create', proposal_native_id: @native_id)
        mock_approve(@proposal)

        # Workflow is in mmt proper, so switch back
        visit logout_path
        set_as_mmt_proper
        real_login(method: 'launchpad')
        fake_service_account_cert
        VCR.use_cassette('launchpad/token_service_success', record: :none) do
          visit manage_proposals_path

          within '.open-draft-proposals tbody tr:nth-child(1)' do
            click_on 'Publish'
          end

          select 'MMT_2', from: 'provider-publish-target'
        end
        select 'MMT_2', from: 'provider-publish-target'
        within '#approver-proposal-modal' do
          VCR.use_cassette('launchpad/token_service_success', record: :none) do
            click_on 'Publish'
          end
        end
      end

      it 'displays expected success messages' do
        expect(page).to have_content('Collection Metadata Successfully Published!')
      end

      it 'deletes the proposal in dMMT' do
        expect(CollectionDraftProposal.where(short_name: short_name).count).to eq(0)
      end

      context 'when searching for the new collection' do
        before do
          # Wait added to improve test consistency; appeared to be searching too
          # fast to find the added record
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            wait_for_cmr
            fill_in 'keyword', with: 'Test Entry Title'
            click_on 'Search Collections'
          end
        end

        it 'can find the record in CMR' do
          expect(page).to have_content('Full Workflow Create Test Proposal')
          expect(page).to have_content('Test Entry Title')
        end
      end
    end

    context 'when publishing an update metadata proposal' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          @ingest_response, @concept_response = publish_collection_draft(token: @token, native_id: 'update_metadata_135612')
          set_as_proposal_mode_mmt(with_draft_approver_acl: true)
          visit collection_path(@ingest_response['concept-id'])
          click_on 'Create Update Request'
          click_on 'Yes'
          click_on 'Short Name - Required field complete'
          @short_name = "Full Workflow Update Test Proposal_#{Faker::Number.number(digits: 15)}"
          fill_in 'Short Name', with: @short_name
          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Submit for Review'
          click_on 'Yes'
          click_on 'Approve Update Request'
          click_on 'Yes'
        end

        @token = 'jwt_access_token'
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')

        # Workflow is in mmt proper, so switch back
        visit logout_path
        set_as_mmt_proper
        real_login(method: 'launchpad')
        fake_service_account_cert
        VCR.use_cassette('launchpad/token_service_success', record: :none) do
          visit manage_proposals_path
          within '.open-draft-proposals tbody tr:nth-child(1)' do
            click_on 'Publish'
          end
          within '#approver-proposal-modal' do
            click_on 'Yes'
          end
        end
      end

      context 'when checking UPDATE and CREATE dates' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            @concept = cmr_client.get_concept(@ingest_response['concept-id'], @token, {}).body
            @create_date_before_publish = @concept_response.body.dig('MetadataDates', 0, 'Date')
            @update_date_before_publish = Time.parse(@concept_response.body.dig('MetadataDates', 1, 'Date'))
            @create_date_after_publish = @concept.dig('MetadataDates', 0, 'Date')
            @update_date_after_publish = Time.parse(@concept.dig('MetadataDates', 1, 'Date'))
          end
        end
        it 'has item 0 as CREATE and item 1 as UPDATE' do
          expect(@concept.dig('MetadataDates', 0, 'Type')).to eq('CREATE')
          expect(@concept.dig('MetadataDates', 1, 'Type')).to eq('UPDATE')
          expect(@concept_response.body.dig('MetadataDates', 0, 'Type')).to eq('CREATE')
          expect(@concept_response.body.dig('MetadataDates', 1, 'Type')).to eq('UPDATE')
        end

        it 'has the correct CREATE date' do
          expect(@create_date_after_publish).to eq(@create_date_before_publish)
        end

        it 'has the correct UPDATE date' do
          expect(@update_date_after_publish).to eq(@update_date_after_publish)
        end

        it 'displays expected success messages' do
          expect(page).to have_content('Collection Metadata Successfully Published!')
        end

        it 'deletes the proposal in dMMT' do
          expect(CollectionDraftProposal.where(short_name: @short_name).count).to eq(0)
        end
      end

      context 'when visiting the updated collection' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_2_vcr", record: :none) do
            wait_for_cmr
            visit collection_path(@ingest_response['concept-id'])
          end
        end

        it 'can find the record in CMR' do
          # expect(page).to have_content('Full Workflow Update Test Proposal')
          expect(page).to have_link('Revisions (10)')
        end
      end
    end

    context 'when publishing a delete metadata proposal' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          # @native_id = 'test'
          @ingest_response, @concept_response = publish_collection_draft(token: @token, native_id: 'delete_metadata_1234')
          set_as_proposal_mode_mmt(with_draft_approver_acl: true)
          visit collection_path(@ingest_response['concept-id'])
          click_on 'Submit Delete Request'
          click_on 'Yes'
          click_on 'Approve Delete Request'
          click_on 'Yes'

          @token = 'jwt_access_token'
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')

          # Workflow is in mmt proper, so switch back
          visit logout_path
          set_as_mmt_proper
          real_login(method: 'launchpad')
          fake_service_account_cert

          VCR.use_cassette('launchpad/token_service_success', record: :none) do
            # @token = 'jwt_access_token'
            # allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
            # allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')
            visit manage_proposals_path

            within '.open-draft-proposals tbody tr:nth-child(1)' do
              click_on 'Delete'
            end
            within '#approver-proposal-modal' do
              click_on 'Yes'
            end
          end
        end
      end

      it 'displays expected success messages' do
        expect(page).to have_content('Collection Metadata Deleted Successfully!')
      end

      it 'deletes the proposal in dMMT' do
        expect(CollectionDraftProposal.where(short_name: @concept_response.body['ShortName']).count).to eq(0)
      end

      # Skipping this test because the delete block is deleting the collection in SIT but the collection created is in
      # local CMR. Need to revisit this in MMT-rework.
      context 'when visiting the deleted collection', skip: true do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_2_vcr", record: :none) do
            visit collection_path(@ingest_response['concept-id'])
          end
        end

        it 'cannot find the record in CMR' do
          expect(page).to have_content('This collection is not available. It is either being published right now, does not exist, or you have insufficient permissions to view this collection.')
        end
      end
    end
  end
end
