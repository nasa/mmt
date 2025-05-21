# :nodoc:
module GkrKeywordRecommendations
  extend ActiveSupport::Concern

  def fetch_keyword_recommendations(user, request_id, provider)
    abstract = get_resource.draft.fetch('Abstract', '')
    response = cmr_client.fetch_keyword_recommendations(abstract)

    if response.error?
      if response.status >= 500 && response.status <= 505    # NGAP LB can't connect to GKR.
        log_gkr_comm_error(user, provider, abstract, request_id, response.status, 'Communication failure with GKR')
        return { 'error': 'CommError' }
      end

      log_gkr_request_failed(user, provider, abstract, response)
      return { id: '', recommendations: [], uuids: [] }
    end

    keyword_recommendations = response.body['recommendations'].map { |rec| rec['keyword'] }

    keyword_uuids = response.body['recommendations'].map { |rec| [rec['keyword'], rec['uuid']] }.to_h
    { id: response.body['uuid'], recommendations: keyword_recommendations, uuids: keyword_uuids }
  end

  def send_feedback(user, request_id, provider, gkr_request_uuid, accepted_uuids, rejected_uuids, new_keywords)
    recommendations = {}
    accepted_uuids.each { |uuid|
      recommendations[uuid] = true
    }
    rejected_uuids.each { |uuid|
      recommendations[uuid] = false
    }
    Rails.logger.info("GKR UUID: #{gkr_request_uuid}");
    Rails.logger.info("Recommendations: #{recommendations}");
    Rails.logger.info("New Keywords: #{new_keywords}") if new_keywords;
    response = cmr_client.send_feedback(gkr_request_uuid, recommendations, new_keywords)
    if response.error?
      if response.status >= 500 && response.status <= 505 # NGAP LB can't connect to GKR.
        log_gkr_feedback_comm_error(user, provider, recommendations.to_json, request_id, gkr_request_uuid, response.status, 'Communication failure with GKR feedback api')
      else
        log_gkr_feedback_request_failed(user, provider, recommendations.to_json, response)
      end
    else
      Rails.logger.info("GKR Response: #{response.status} #{response.body}");
    end
  end

  def log_gkr_comm_error(user, provider, abstract, request_id, status, reason)
    Rails.logger.info("GkrLog: type: FAILED - date: #{Time.new} - env: #{Rails.env} - user_id: #{user} - request_id: #{request_id} - provider: #{provider}"\
      " - abstract: #{abstract} - error_code: #{status} - failure_description: #{reason}")
  end

  def log_gkr_request_failed(user, provider, abstract, response)
    Rails.logger.info("GkrLog: type: FAILED - date: #{Time.new} - env: #{Rails.env} - user_id: #{user} - provider: #{provider}"\
      " - abstract: #{abstract} - error_code: #{response.status} - failure_description: #{response.body['description']}")
  end

  def log_gkr_feedback_comm_error(user, provider, recommendations, request_id, gkr_request_id, status, reason)
    Rails.logger.info("GkrLog: type: FAILED - date: #{Time.new} - env: #{Rails.env} - user_id: #{user} - request_id: #{request_id} - gkr_request_id: #{gkr_request_id} provider: #{provider}"\
      " - recommendations: #{recommendations} - error_code: #{status} - failure_description: #{reason}")
  end

  def log_gkr_feedback_request_failed(user, provider, recommendations, response)
    Rails.logger.info("GkrLog: type: FAILED - date: #{Time.new} - env: #{Rails.env} - user_id: #{user} - provider: #{provider}"\
      " - recommendations: #{recommendations} - error_code: #{response.status} - failure_description: #{response.body['description']}")
  end

  def log_gkr_on_save_keywords(user, provider, abstract, request_id, recommendations, science_keywords)
    Rails.logger.info("GkrLog: type: SAVE - date: #{Time.new} - env: #{Rails.env} - user_id: #{user} - provider: #{provider}"\
      " - request_id: #{request_id} - abstract: #{abstract}"\
      " - predictions: #{recommendations} - science_keywords=#{science_keywords}")
  end

  def log_gkr_on_publish(user_id, provider_id, abstract, request_id, recommended_keywords, science_keywords)
    selected_keywords = science_keywords.map { |keyword| keyword.values.join(' > ') }
    accepted = recommended_keywords.split(',').select { |keyword| selected_keywords.include? keyword }
    rejected = recommended_keywords.split(',').reject { |keyword| selected_keywords.include? keyword }
    Rails.logger.info("GkrLog: type: PUBLISH - date: #{Time.new} - env: #{Rails.env} - user_id: #{user_id} - provider: #{provider_id}"\
      " - request_id: #{request_id}"\
      " - accepted_recommendations: #{accepted}"\
      " - rejected_recommendations: #{rejected}")
  end
end
