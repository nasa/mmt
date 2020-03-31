module Helpers
  module ApprovedProposalsHelpers
    def mock_valid_token_validation
      validate_response_body = '{"uid":"testuser"}'
      validate_response = cmr_success_response(validate_response_body)
      allow_any_instance_of(Cmr::UrsClient).to receive(:validate_token).and_return(validate_response)
    end

    def mock_invalid_token_validation
      validate_response_body = '{"error":"token_expired","error_description":"The token has expired"}'
      validate_response = cmr_fail_response(JSON.parse(validate_response_body), 403)
      allow_any_instance_of(Cmr::UrsClient).to receive(:validate_token).and_return(validate_response)
    end

    def mock_forbidden_approved_proposals
      forbidden_response_body = '{ "body" : "nil" }'
      forbidden_response = cmr_fail_response(JSON.parse(forbidden_response_body), 403)
      allow_any_instance_of(Cmr::DmmtClient).to receive(:dmmt_get_approved_proposals).and_return(forbidden_response)
    end

    def mock_cmr_get_collections(granule_count: 0, hits: 1)
      cmr_response_body = {
        'hits' => hits.to_i,
        'items' => [{
          'meta' => { 'granule-count' => granule_count.to_i }
        }]
      }.to_json
      cmr_response = cmr_success_response(cmr_response_body)
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(cmr_response)
    end

    # Takes an array of hashes.  Each hash represents a proposal to be mocked.
    # Hashes are assumed to have keys that match fields in the db table
    # Any values not provided are given a default value.
    def mock_retrieve_approved_proposals(proposal_info:)
      proposals = []
      proposal_info.each do |params|
        short_name = params[:short_name] || 'Test Proposal Short Name'
        entry_title = params[:entry_title] || 'Test Proposal Title'
        default_time = Time.new.to_s
        proposals << {
          "id": params[:id] || 1,
          "user_id": params[:user_id] || 1,
          "short_name": short_name,
          "entry_title": entry_title,
          "provider_id": params[:provider_id] || 'MMT_2',
          "native_id": params[:native_id] || 'dmmt_collection_1',
          "proposal_status": "approved",
          "created_at": default_time,
          "updated_at": default_time,
          "status_history": params[:status_history] || {"submitted":{"username":"Test User1","action_date":"2019-11-25 13:59"},"approved":{"username":"Test User1","action_date":"2019-11-25T08:59:50.748-05:00"}},
          "request_type": params[:request_type] || 'create',
          "submitter_id": 'testuser',
          "draft": params[:draft] || collection_one.merge('ShortName' => short_name, 'Version' => params[:version] || '1', 'EntryTitle' => entry_title)
        }
      end

      dmmt_response = cmr_success_response({ 'proposals' => proposals }.to_json)
      allow_any_instance_of(Cmr::DmmtClient).to receive(:dmmt_get_approved_proposals).and_return(dmmt_response)
    end

    def mock_update_proposal_status(succeed: true)
      dmmt_response = if succeed
                        cmr_success_response({'body' => nil}.to_json)
                      else
                        cmr_fail_response({ 'body' => nil }.to_json, 400)
                      end
      allow_any_instance_of(Cmr::DmmtClient).to receive(:dmmt_update_proposal_status).and_return(dmmt_response)
    end

    # Fake getting user names from URS for updating proposal status in dMMT
    # Can pass an array of users to be specifically included, then will add
    # users on top of that a specified number of times.
    def mock_urs_get_users(count: 1, users: [])
      urs_response_body = { 'users' => users.blank? ? [] : users }
      count.times do
        urs_response_body['users'].push({ 'first_name' => 'Test', 'last_name' => 'User', 'uid' => 'testuser' })
      end
      urs_response = cmr_success_response(urs_response_body.to_json)
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_urs_users).and_return(urs_response)
    end

    # Fake getting ACLs from CMR, then getting groups from CMR, then getting group members from CMR
    def mock_get_approver_emails
      get_permissions_response_body = { 'items' => [{ 'revision_id' => 1, 'concept_id' => 'ACL1200000353-CMR', 'identity_type' => 'Provider', 'name' => 'Provider - MMT_2 - NON_NASA_DRAFT_APPROVER', 'location' => 'http://localhost:3011/acls/ACL1200000353-CMR' }] }
      get_permission_response_body = { 'group_permissions' => [{ 'group_id' => 'AG1200000351-MMT_2', 'permissions' => ['create'] }] }
      group_member_response_body = %w[user1 user2]

      get_permissions_response = cmr_success_response(get_permissions_response_body.to_json)
      get_permission_response = cmr_success_response(get_permission_response_body.to_json)
      group_member_response = cmr_success_response(group_member_response_body.to_json)

      allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).and_return(get_permissions_response)
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_permission).and_return(get_permission_response)
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_group_members).and_return(group_member_response)
    end
  end
end
