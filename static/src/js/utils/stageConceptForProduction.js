import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls /providers/{providerId}/{conceptType}/stage-for-production to forward a concept's
 * metadata to another MMT environment so it can be staged there for review.
 * @param {string} providerId A provider id that a given user is using
 * @param {string} token A user's token
 * @param {string} conceptType The S3 concept type of the metadata being staged (e.g. 'collections')
 * @param {Object} ummMetadata An object with the metadata key value pairs
 */
const stageConceptForProduction = async (providerId, token, conceptType, ummMetadata) => {
  const { apiHost } = getApplicationConfig()

  const response = await fetch(`${apiHost}/providers/${providerId}/${conceptType}/stage-for-production`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ummMetadata)
  })

  let data

  try {
    data = await response.json()
  } catch (jsonError) {
    data = null
  }

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to stage this provider\'s collections.')
    }

    const { error } = data || {}

    throw new Error(error || 'Failed to stage concept for production')
  }

  return data
}

export default stageConceptForProduction
