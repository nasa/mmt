import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls /providers/{providerId}/templates/{id} lambda to get update a template
 * @param {string} providerId A provider id that a given user is using
 * @param {Object} token A users token
 * @param {Object} ummMetadata An object with the metadata key value pairs
 * @param {string} id An id for a collection template
 */
const updateTemplate = async (providerId, token, ummMetadata, id) => {
  const { apiHost } = getApplicationConfig()
  const { tokenValue } = token

  try {
    const response = await fetch(`${apiHost}/providers/${providerId}/templates/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenValue}`
      },
      body: JSON.stringify({
        ...ummMetadata
      })
    })
    const data = await response

    if (response.ok) {
      return data
    }

    return { error: response }
  } catch (e) {
    return {
      error: 'Error updating template'
    }
  }
}

export default updateTemplate
