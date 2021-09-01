# Start to finish test of the approver workflow without mocking the inter-MMT
# communications.
describe 'When going through the whole collection proposal approver workflow', js: true do
  before do
    login(real_login: true)
    mock_urs_get_users
    allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(true)
  end

  context 'when loading the manage proposals page' do
    context 'when publishing a proposal to check that the UPDATE and CREATE dates are being correctly populated' do
      let(:concept_id)                { cmr_client.get_collections_by_post({ EntryTitle: 'Date-Check', ShortName: 'Proposal for checking MetadataDates' }, nil, 'umm_json').body.dig('items', 0, 'meta', 'concept-id') }
      let(:concept)                   { cmr_client.get_concept(concept_id, 'access_token', {}).body }
      let(:short_name)                { 'Proposal for checking MetadataDates' }
      let(:create_date_after_publish) { Time.parse(concept.dig('MetadataDates', 0, 'Date')) }
      let(:update_date_after_publish) { Time.parse(concept.dig('MetadataDates', 1, 'Date')) }

      before do
        # FactoryBot respects validations; need to be in proposal mode to create
        set_as_proposal_mode_mmt(with_draft_approver_acl: true)
        @native_id = 'dmmt_collection_2'
        @proposal = create(:collection_draft_proposal_all_required_fields, proposal_short_name: short_name, proposal_entry_title: 'Date-Check', proposal_request_type: 'create', proposal_native_id: @native_id)
        mock_approve(@proposal)
        # Workflow is in mmt proper, so switch back
        set_as_mmt_proper
        # Mock URS communication because it has no concept of our test users
        mock_valid_token_validation
        visit manage_proposals_path

        within '.open-draft-proposals tbody tr:nth-child(1)' do
          click_on 'Publish'
        end
        select 'MMT_2', from: 'provider-publish-target'
        within '#approver-proposal-modal' do
          click_on 'Publish'
        end
        wait_for_cmr
      end

      after do
        cmr_client.delete_collection('MMT_2', @native_id, 'access_token')
      end

      it 'has item 0 as CREATE and item 1 as UPDATE' do
        expect(concept.dig('MetadataDates', 0, 'Type')).to eq('CREATE')
        expect(concept.dig('MetadataDates', 1, 'Type')).to eq('UPDATE')
      end

      it 'contains the correct CREATE and UPDATE dates' do
        expect(@proposal.draft['MetadataDates']).to be_nil
        expect(create_date_after_publish).to be_within(1.minute).of(Time.now)
        expect(update_date_after_publish).to be_within(1.minute).of(Time.now)
      end
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
        set_as_mmt_proper
        # Mock URS communication because it has no concept of our test users
        mock_valid_token_validation
        visit manage_proposals_path

        within '.open-draft-proposals tbody tr:nth-child(1)' do
          click_on 'Publish'
        end
        select 'MMT_2', from: 'provider-publish-target'
        within '#approver-proposal-modal' do
          click_on 'Publish'
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
          wait_for_cmr
          fill_in 'keyword', with: 'MMT_2'
          click_on 'Search Collections'
        end

        it 'can find the record in CMR' do
          expect(page).to have_content('Full Workflow Create Test Proposal')
          expect(page).to have_content('Test Entry Title')
        end
      end
    end

    context 'when publishing an update metadata proposal' do
      before do
        @ingest_response, @concept_response = publish_collection_draft
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
        # Workflow is in mmt proper, so switch back
        set_as_mmt_proper

        # Mock URS communication because it has no concept of our test users
        mock_valid_token_validation
        visit manage_proposals_path

        within '.open-draft-proposals tbody tr:nth-child(1)' do
          click_on 'Publish'
        end
        within '#approver-proposal-modal' do
          click_on 'Yes'
        end
      end

      context 'when checking UPDATE and CREATE dates' do
        let(:concept)                    { cmr_client.get_concept(@ingest_response['concept-id'], 'access_token', {}).body }
        let(:create_date_before_publish) { @concept_response.body.dig('MetadataDates', 0, 'Date') }
        let(:update_date_before_publish) { Time.parse(@concept_response.body.dig('MetadataDates', 1, 'Date')) }
        let(:create_date_after_publish)  { concept.dig('MetadataDates', 0, 'Date') }
        let(:update_date_after_publish)  { Time.parse(concept.dig('MetadataDates', 1, 'Date')) }

        it 'has item 0 as CREATE and item 1 as UPDATE' do
          expect(concept.dig('MetadataDates', 0, 'Type')).to eq('CREATE')
          expect(concept.dig('MetadataDates', 1, 'Type')).to eq('UPDATE')
          expect(@concept_response.body.dig('MetadataDates', 0, 'Type')).to eq('CREATE')
          expect(@concept_response.body.dig('MetadataDates', 1, 'Type')).to eq('UPDATE')
        end

        it 'has the correct CREATE date' do
          expect(create_date_after_publish).to eq(create_date_before_publish)
        end

        it 'has the correct UPDATE date' do
          expect(update_date_after_publish - update_date_before_publish).to be > 1.minute
          expect(update_date_after_publish).to be > update_date_before_publish
          expect(update_date_after_publish).to be_within(1.minute).of(Time.now)
        end
      end

      it 'displays expected success messages' do
        expect(page).to have_content('Collection Metadata Successfully Published!')
      end

      it 'deletes the proposal in dMMT' do
        expect(CollectionDraftProposal.where(short_name: @short_name).count).to eq(0)
      end

      context 'when visiting the updated collection' do
        before do
          wait_for_cmr
          visit collection_path(@ingest_response['concept-id'])
        end

        it 'can find the record in CMR' do
          expect(page).to have_content('Full Workflow Update Test Proposal')
          expect(page).to have_link('Revisions (2)')
        end
      end
    end

    context 'when publishing a delete metadata proposal' do
      before do
        @ingest_response, @concept_response = publish_collection_draft
        set_as_proposal_mode_mmt(with_draft_approver_acl: true)
        visit collection_path(@ingest_response['concept-id'])
        click_on 'Submit Delete Request'
        click_on 'Yes'
        click_on 'Approve Delete Request'
        click_on 'Yes'
        # Workflow is in mmt proper, so switch back
        set_as_mmt_proper
        # Mock URS communication because it has no concept of our test users
        mock_valid_token_validation
        visit manage_proposals_path

        within '.open-draft-proposals tbody tr:nth-child(1)' do
          click_on 'Delete'
        end

        within '#approver-proposal-modal' do
          click_on 'Yes'
        end
      end

      it 'displays expected success messages' do
        expect(page).to have_content('Collection Metadata Deleted Successfully!')
      end

      it 'deletes the proposal in dMMT' do
        expect(CollectionDraftProposal.where(short_name: @concept_response.body['ShortName']).count).to eq(0)
      end

      context 'when visiting the deleted collection' do
        before do
          visit collection_path(@ingest_response['concept-id'])
        end

        it 'cannot find the record in CMR' do
          expect(page).to have_content('This collection is not available. It is either being published right now, does not exist, or you have insufficient permissions to view this collection.')
        end
      end
    end
  end
end
