import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls /providers/{providerId}/template/{id} lambda to get a delete a template
 * @param {string} providerId A provider id that a given user is using
 * @param {Object} token A users token
 * @param {Object} id An id of the template
 */
const delateTemplate = async (providerId, token, id) => {
  const { apiHost } = getApplicationConfig()

  const response = await fetch(`${apiHost}/providers/${providerId}/templates/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await response

  if (response.ok) {
    return { response: data }
  }

  return { error: response }
}

export default delateTemplate
