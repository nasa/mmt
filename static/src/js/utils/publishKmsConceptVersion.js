import { getApplicationConfig } from 'sharedUtils/getConfig'
/**
 * Publishes a new KMS concept version.
 *
 * This function takes a version string, processes it, and sends a POST request
 * to the KMS API to publish a new concept version.
 *
 * @param {string} version - The version string to be published.
 * @throws {Error} If there's an error during the publishing process.
 *
 * @example
 * // Usage example
 * try {
 *   const result = await publishKmsConceptVersion('Version 1.0');
 *   console.log('Successfully published:', result);
 * } catch (error) {
 *   console.error('Failed to publish version:', error.message);
 * }
 */
export const publishKmsconceptVersion = async (version) => {
  try {
    // Trim and process version to replace spaces with underscores
    const processedVersion = version.trim().replace(/\s+/g, '_')
    const payload = {
      name: processedVersion
    }
    const { kmsHost } = getApplicationConfig()
    const endPoint = `${kmsHost}/publish`
    const options = {
      method: 'POST',
      body: JSON.stringify(payload)
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
