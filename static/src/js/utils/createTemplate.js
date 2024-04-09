import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls /providers/{providerId}/template/{id} lambda to get a create a new template
 * @param {string} providerId A provider id that a given user is using
 * @param {Object} token A users token
 * @param {Object} ummMetadata An object with the metadata key value pairs
 */
const createTemplate = async (providerId, token, ummMetadata) => {
  const { apiHost } = getApplicationConfig()
  const { tokenValue } = token

  try {
    const response = await fetch(`${apiHost}/providers/${providerId}/templates`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenValue}`
      },
      body: JSON.stringify({
        pathParameters: {
          providerId
        },
        ...ummMetadata
      })
    })
    const data = await response.json()

    if (response.ok) {
      return data.id
    }

    return { error: response }
  } catch (e) {
    return {
      error: e
    }
  }
}

export default createTemplate
