import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls /providers/{providerId}/template/{id} lambda to get a single template
 * @param {string} providerId A provider id that a given user is using
 * @param {Object} token A users token
 * @param {string} id An id for a collection template
 */
const getTemplate = async (providerId, token, id) => {
  const { apiHost } = getApplicationConfig()
  const { tokenValue } = token

  try {
    const response = await fetch(`${apiHost}/providers/${providerId}/templates/${id}`, {
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

export default getTemplate
