module Cmr
  class DmmtClient < BaseClient
    def dmmt_get_approved_proposals(params, token)
      url = if Rails.env.development? || Rails.env.test?
              'http://mmt.localtest.earthdata.nasa.gov/approved_proposals'
            else
              '/approved_proposals'
            end

      get(url, params.to_json, token_header(token))
    end
  end
end
