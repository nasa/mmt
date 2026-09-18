import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls GET /staged/{conceptType}/{recordId} to retrieve a staged concept's metadata
 * @param {string} token A user's token
 * @param {string} conceptType The S3 concept type of the staged metadata (e.g. 'collections')
 * @param {string} recordId The id of the staged record
 */
const getStagedConcept = async (token, conceptType, recordId) => {
  const { apiHost } = getApplicationConfig()

  const response = await fetch(`${apiHost}/staged/${conceptType}/${recordId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Staged metadata not found. It may have expired or already been saved as new draft.')
  }

  return response.json()
}

export default getStagedConcept
