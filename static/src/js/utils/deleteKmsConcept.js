import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Deletes a KMS concept from the server.
 *
 * @async
 * @function deleteKmsConcept
 * @param {Object} params - The parameters for deleting the KMS concept.
 * @param {string} params.conceptId - The ID of the concept to be deleted.
 * @param {string} params.version - The version of the concept to be deleted.
 * @param {string} params.token - The authorization token for the API request.
 * @throws {Error} If there's an error during the deletion process.
 * @returns {Promise<void>} A promise that resolves when the concept is successfully deleted.
 *
 * @example
 * // Usage example:
 * import { deleteKmsConcept } from './utils/deleteKmsConcept';
 *
 * try {
 *   await deleteKmsConcept({
 *     conceptId: '12345',
 *     version: '1.0',
 *     token: 'Bearer your-auth-token-here'
 *   });
 *   console.log('Concept deleted successfully');
 * } catch (error) {
 *   console.error('Failed to delete concept:', error.message);
 * }
 */
export const deleteKmsConcept = async ({ conceptId, version, token }) => {
  try {
    const { kmsHost } = getApplicationConfig()
    const endPoint = `${kmsHost}/concept/${conceptId}?version=${version}`
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: token
      }
    }
    const response = await fetch(endPoint, options)
    if (!response.ok) {
      throw new Error(`deleteKmsConcept HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting keyword:', error)
    throw new Error(`Error deleting keyword: ${error.message}`)
  }
}
