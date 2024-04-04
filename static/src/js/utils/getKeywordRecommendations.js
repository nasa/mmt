import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls gkrKeywordRecommendations lambda /gkr-request-keywords to fetch a list of recommended keywords
 * given a metadata summary
 * @param {Object} summary The metadata summary or abstract
 */
const getKeywordRecommendations = async (summary) => {
  const query = {
    description: summary
  }

  const { apiHost } = getApplicationConfig()

  const options = {
    method: 'POST',
    body: JSON.stringify(query)
  }

  return fetch(`${apiHost}/gkr-keyword-recommendations`, (options))
    .then((response) => response.json())
    .catch((err) => err)
}

export default getKeywordRecommendations
