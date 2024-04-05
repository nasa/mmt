import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls /providers/{providerId}/templates lambda to get list of templates
 * for a given provider
 * @param {string} providerId A provider id that a given user is using
 * @param {Object} token A users token
 */
const getTemplates = async (providerId, token) => {
  const { apiHost } = getApplicationConfig()
  const { tokenValue } = token

  try {
    const response = await fetch(`${apiHost}/providers/${providerId}/templates`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenValue}`
      }
    })
    const data = await response.json()

    return { response: data }
  } catch (e) {
    return {
      error: 'Error retrieving templates'
    }
  }
}

export default getTemplates
