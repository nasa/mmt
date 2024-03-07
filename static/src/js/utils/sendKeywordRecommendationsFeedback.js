import { getApplicationConfig } from './getConfig'

/**
 * Calls gkrSendFeedback lambda /gkr-send-feedback to provide feedback on keyword recommendations
 * in order to help train the model
 * @param {Object} requestUuid the GKR request id
 * @param {Object} recommendations of the form {uuid:boolean} telling the API whether the uuid was accepted
 * @param {Array} newKeywords the new keywords not recommended
 */
const sendKeywordRecommendationsFeedback = async (requestUuid, recommendations, newKeywords) => {
  const payload = {
    recommendations,
    keywords: newKeywords
  }

  const { apiHost } = getApplicationConfig()

  const options = {
    method: 'PUT',
    body: JSON.stringify(payload)
  }

  return fetch(`${apiHost}/gkr-send-feedback?uuid=${requestUuid}`, (options))
    .then((response) => response.json())
    .catch((err) => err)
}

export default sendKeywordRecommendationsFeedback
