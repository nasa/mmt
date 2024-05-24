import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls /templates lambda to get list of all templates
 * @param {Object} token A users token
 */
const getTemplates = async (token) => {
  const { apiHost } = getApplicationConfig()

  try {
    const response = await fetch(`${apiHost}/templates`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
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
