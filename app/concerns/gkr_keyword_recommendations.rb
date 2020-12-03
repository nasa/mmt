# :nodoc:
module GKRKeywordRecommendations
  extend ActiveSupport::Concern

  def fetch_keyword_recommendations(user,provider)
    abstract = get_resource.draft.fetch('Abstract', '')
    
    response = cmr_client.fetch_keyword_recommendations(abstract)
    
    if response.error?
      log_gkr_request_failed(user, provider, abstract, response)
      return {id: "",recommendations: []}
    end
      
    keyword_recommendations = response.body['recommendations'].map { |rec| rec['keyword'] }
    return {id: response.body['uuid'],recommendations: keyword_recommendations}
  end
  
  def log_gkr_request_failed( user, provider, abstract, response)
      Rails.logger.info("GkrLog: type: FAILED - date: #{Time.new} - env: #{Rails.env} - user_id: #{user} - provider: #{provider}"\
        " - abstract: #{abstract} - error_code: #{response.status} - failure_description: #{response.body['description']}")
  end
  
  def log_gkr_on_save_keywords(user, provider, abstract, request_id, recommendations, science_keywords)
      Rails.logger.info("GkrLog: type: SAVE - date: #{Time.new} - env: #{Rails.env} - user_id: #{user} - provider: #{provider}"\
        " - request_id: #{request_id} - abstract: #{abstract}"\
        " - predictions: #{recommendations} - science_keywords=#{science_keywords}")
  end
  

  def log_gkr_on_publish(user_id,provider_id, abstract, request_id, recommended_keywords, science_keywords)
        selected_keywords = science_keywords.map { | keyword | keyword.values.join(" > ")}
        accepted = recommended_keywords.split(',').select{|keyword| selected_keywords.include? keyword }
        rejected = recommended_keywords.split(',').reject{|keyword| selected_keywords.include? keyword}
        Rails.logger.info("GkrLog: type: PUBLISH - date: #{Time.new} - env: #{Rails.env} - user_id: #{user_id} - provider: #{provider_id}"\
                          " - request_id: #{request_id}"\
                          " - accepted_recommendations: #{accepted}"\
                          " - rejected_recommendations: #{rejected}")
  end
  
end
