module Cmr
  class DmmtClient < BaseClient
    def dmmt_get_approved_proposals(params, token)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3000/approved_proposals'
            else
              '/approved_proposals'
            end


      headers = {
        'Content-Type' => 'application/json'
      }

      get(url, params, headers.merge(token_header(token, true)))
    end
  end
end
