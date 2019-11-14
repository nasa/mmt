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
  end
end
