module Cmr
  class DmmtClient < BaseClient
    def dmmt_get_approved_proposals(token, request = nil)
      url = if Rails.env.development?
              'http://localhost:3000/approved_proposals'
            elsif Rails.env.test?
              "http://#{request.ip}:#{request.port}/approved_proposals"
            else
              '/approved_proposals'
            end


      headers = {
        'Content-Type' => 'application/json'
      }

      get(url, nil, headers.merge(token_header(token, true)))
    end

    def dmmt_update_proposal_status(params, token, request = nil)
      url = if Rails.env.development?
              'http://localhost:3000/approved_proposals/update_proposal_status'
            elsif Rails.env.test?
              "http://#{request.ip}:#{request.port}/approved_proposals/update_proposal_status"
            else
              '/approved_proposals/update_proposal_status'
            end


      headers = {
        'Content-Type' => 'application/json'
      }

      get(url, params, headers.merge(token_header(token, true)))
    end
  end
end
