# :nodoc:
module GKRKeywordRecommendations
  extend ActiveSupport::Concern

  def fetch_keyword_recommendations
    abstract = get_resource.draft.fetch('Abstract', '')
    response = cmr_client.fetch_keyword_recommendations(abstract)
    keyword_recommendations = if response.success?
                                response.body['recommendations'].map { |rec| rec['keyword'] }
                              else
                                []
                              end
    # TODO log recommendations (and failure)
  end
end
