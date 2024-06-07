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

  try {
    const response = await fetch(`${apiHost}/providers/${providerId}/templates/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...ummMetadata
      })
    })

    if (response.ok) {
      return response
    }

    throw new Error('Failed to update template')
  } catch (e) {
    return {
      error: 'Error updating template'
    }
  }
}

export default updateTemplate
