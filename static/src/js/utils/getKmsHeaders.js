import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Returns the standard headers for KMS API requests
 *
 * @returns {Object} Headers object
 *
 * @example
 * // Usage in fetch requests
 * const response = await fetch(url, {
 *   headers: getKmsHeaders()
 * })
 */
export const getKmsHeaders = () => {
  const { kmKmsClientID } = getApplicationConfig()

  return {
    'client-id': kmKmsClientID
  }
}

export default getKmsHeaders
