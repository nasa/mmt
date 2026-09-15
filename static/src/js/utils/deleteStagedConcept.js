import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls DELETE /staged/{conceptType}/{recordId} to remove a staged concept's metadata
 * @param {string} token A user's token
 * @param {string} conceptType The S3 concept type of the staged metadata (e.g. 'collections')
 * @param {string} recordId The id of the staged record
 */
const deleteStagedConcept = async (token, conceptType, recordId) => {
  const { apiHost } = getApplicationConfig()

  const response = await fetch(`${apiHost}/staged/${conceptType}/${recordId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to delete staged metadata')
  }
}

export default deleteStagedConcept
