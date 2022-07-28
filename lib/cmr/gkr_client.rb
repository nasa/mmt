module Cmr
  class GkrClient < BaseClient
    def fetch_keyword_recommendations(abstract)
      url = '/api/requests/'

      query = { 'description' => abstract }

      headers = {
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      }

      # this post does a search, not a write, and will be needed by proposals
      proposal_mode_safe_post(url, query.to_json, headers)
    end

    def send_feedback(gkr_request_uuid, recommendations, new_keywords)
      url = "/api/requests/#{gkr_request_uuid}"
      payload = {"recommendations": recommendations, "keywords": new_keywords}
      headers = {
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      }
      proposal_mode_safe_put(url, payload.to_json, headers)
    end

  end
end
