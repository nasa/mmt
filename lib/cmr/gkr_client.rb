module Cmr
  class GkrClient < BaseClient
    def fetch_keyword_recommendations(abstract)
      # GKR does not have SIT or UAT endpoints
      url = '/api/requests/'

      query = { 'description' => abstract }

      headers = {
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      }

      # this post does a search, not a write, and will be needed by proposals
      proposal_mode_safe_post(url, query.to_json, headers)
    end
  end
end
