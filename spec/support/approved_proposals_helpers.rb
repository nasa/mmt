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
          "draft": params[:draft] || collection_one.merge('ShortName' => short_name, 'Version' => params[:version] || '1', 'EntryTitle' => entry_title)
        }
      end

      dmmt_response = cmr_success_response({ 'proposals' => proposals }.to_json)
      allow_any_instance_of(Cmr::DmmtClient).to receive(:dmmt_get_approved_proposals).and_return(dmmt_response)
    end
  end
end
