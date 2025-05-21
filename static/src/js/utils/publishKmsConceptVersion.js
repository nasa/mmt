import _ from 'lodash'
import { getApplicationConfig } from 'sharedUtils/getConfig'
/**
 * Publishes a new KMS concept version.
 *
 * This function takes a version string and an authentication token, processes the version,
 * and sends a POST request to the KMS API to publish a new concept version.
 *
 * @param {string} version - The version string to be published.
 * @param {string} token - The authentication token for the API request.
 * @throws {Error} If there's an error during the publishing process.
 * @returns {Promise<void>} A promise that resolves when the publication is successful.
 *
 * @example
 * // Usage example
 * try {
 *   await publishKmsConceptVersion('Version 1.0', 'auth_token_here');
 *   console.log('Successfully published version');
 * } catch (error) {
 *   console.error('Failed to publish version:', error.message);
 * }
 */
export const publishKmsConceptVersion = async (version, token) => {
  try {
    // Trim and process version to replace spaces with underscores
    const processedVersion = _.replace(_.trim(version), /\s+/g, '_')
    const { kmsHost } = getApplicationConfig()
    const endPoint = `${kmsHost}/publish?name=${processedVersion}`
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      }
    }
    const response = await fetch(endPoint, options)
    if (!response.ok) {
      throw new Error(`publishKmsconceptVersion HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error publishing new keyyword version:', error)
    throw new Error(`Error publishing new keyword version: ${error.message}`)
  }
}
