import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls /providers/{providerId}/template/{id} lambda to get a single template
 * @param {string} providerId A provider id that a given user is using
 * @param {Object} token A users token
 * @param {string} id An id for a collection template
 */
const getTemplate = async (token, id) => {
  const { apiHost } = getApplicationConfig()

  try {
    const response = await fetch(`${apiHost}/templates/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json()

    return { response: data }
  } catch (e) {
    return {
      error: 'Error retrieving template'
    }
  }
}

export default getTemplate
